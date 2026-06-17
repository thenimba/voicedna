import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface QAPair {
  questionNumber?: number;
  category?: string;
  question?: string;
  answer?: string;
  isFollowUp?: boolean;
}

interface Body {
  userName?: string;
  qaPairs?: QAPair[];
}

const SYSTEM_PROMPT = `You are a Voice Profile Analyst. You receive a raw transcript from a 100-question "Taste Interviewer" interview (the framework by Ruben Hassid / How to AI). The user's answers may be in English, Hebrew, or a mix. Your job is to ANALYZE and SYNTHESIZE those answers into a polished voice-DNA profile document.

CRITICAL RULES:
1. Write the ENTIRE output in English, regardless of the input language. If you quote a Hebrew answer as an example, translate it to English and include the original in parentheses only when the original phrasing carries character.
2. Do NOT just dump the questions and answers back. SYNTHESIZE patterns, contradictions, and signature traits across answers.
3. Be specific. Reference concrete examples the user gave. Avoid generic personality-test platitudes.
4. Total length: 1500–2500 words.
5. Output pure Markdown only — no preamble, no "Here is the profile", no closing remarks.

REQUIRED STRUCTURE (in this exact order):

# VOICE PROFILE: <name>

## Core Identity
Two to three sentences capturing the essence of this writer. This is the ONLY summary section.

---

## SECTION 1: BELIEFS & CONTRARIAN TAKES
Synthesized analysis of what the writer believes, what they reject, and the contrarian positions they hold. Pull direct quotes (translated) when they're sharp. 3–6 bullet points or short paragraphs.

## SECTION 2: WRITING MECHANICS
How they actually write — sentence length, punctuation habits, openings, closings, transitions, vocabulary preferences. Use specifics from their answers.

## SECTION 3: AESTHETIC CRIMES
What makes them cringe in other people's writing. Patterns they actively reject.

## SECTION 4: VOICE & PERSONALITY
Tone, humor, warmth/coolness, how they handle disagreement, how they sound when excited vs. skeptical.

## SECTION 5: STRUCTURAL PREFERENCES
How they organize ideas — lists vs. prose, headers, transitions, default structures, length preferences.

## SECTION 6: HARD NOS
Things they would never write or do. Lines they will not cross.

## SECTION 7: RED FLAGS
Signals that make them distrust a piece of writing or a writer.

---

## QUICK REFERENCE CARD

### Always
Bullet list of specific patterns to follow.

### Never
Bullet list of specific things to avoid.

### Signature Phrases & Structures
Actual phrasings drawn from the transcript (translated when needed).

### Voice Calibration
2–4 direct quotes (translated) that capture tone.

---

## ANTI-OVERFITTING GUIDE

Reproduce the standard guidance about spirit-over-letter, frequency labels (HARD RULE / STRONG TENDENCY / LIGHT PREFERENCE), context adaptation, and natural variation. Then fill in:

### What Matters Most
1. <The single most important belief about writing for this person — derived from their answers.>
2. <The one pattern that makes their voice theirs.>
3. <The #1 thing they never do.>

---

## RECOMMENDED SYSTEM PROMPT

A ready-to-paste system prompt embodying this voice DNA. Put it inside a fenced code block tagged \`text\`. The prompt must:
- Address the AI in the second person ("You are writing as <name>…")
- Encode the 3–6 highest-leverage rules from the analysis (not all of them — only the ones that matter most)
- Include 1–2 short example phrasings the AI can pattern-match against
- End with: "Before you finalize anything, ask: does this sound like something <name> would actually write, or like an AI imitating them?"

Keep this final prompt under 350 words so it pastes cleanly into any AI session.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { userName, qaPairs }: Body = await req.json();
    if (!Array.isArray(qaPairs) || qaPairs.length === 0) {
      return new Response(JSON.stringify({ error: "Missing qaPairs" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const name = (userName || "Anonymous").trim();
    const transcript = qaPairs
      .map((qa, i) => {
        const tag = qa.isFollowUp ? " (follow-up)" : "";
        return `[#${qa.questionNumber ?? i + 1} · ${qa.category ?? "general"}${tag}]\nQ: ${qa.question ?? ""}\nA: ${qa.answer ?? ""}`;
      })
      .join("\n\n");

    const userPrompt = `Subject name: ${name}\nTotal answers: ${qaPairs.length}\n\nTRANSCRIPT (mixed languages possible):\n\n${transcript}\n\nNow produce the full English voice-DNA profile per the required structure.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("AI gateway error", res.status, text);
      const status = res.status === 429 || res.status === 402 ? res.status : 502;
      return new Response(
        JSON.stringify({
          error:
            res.status === 429
              ? "Rate limit reached. Try again in a moment."
              : res.status === 402
                ? "AI credits exhausted. Add credits in workspace settings."
                : "Could not generate the profile.",
        }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await res.json();
    const markdown: string = data?.choices?.[0]?.message?.content?.trim?.() ?? "";
    if (!markdown) {
      return new Response(JSON.stringify({ error: "Empty response" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ markdown }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-voice-profile failed", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
