import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface Body {
  question?: string;
  category?: string;
  lang?: "en" | "he";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { question, category, lang }: Body = await req.json();
    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "Missing question" }), {
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

    const targetLang = lang === "he" ? "Hebrew" : "English";
    const system = `You are helping a writer answer a self-reflection interview question about their writing taste and voice. Produce ONE short example answer (40–70 words) in ${targetLang}, written in first person.

Rules:
- It should sound like a thoughtful but informal human — specific, not generic.
- Pick a concrete angle; do NOT try to cover the whole question.
- Begin with phrasing that signals it's an example ("For example, I…" / "לדוגמה, אני…").
- No preamble, no quotes, no markdown, no headings, no bullet points.
- Plain prose only.`;

    const userPrompt = `Category: ${category ?? "general"}\nQuestion: ${question}\n\nWrite the example answer now in ${targetLang}.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
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
                ? "AI credits exhausted."
                : "Could not generate an example.",
        }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await res.json();
    const example: string =
      data?.choices?.[0]?.message?.content?.trim?.() ?? "";

    if (!example) {
      return new Response(JSON.stringify({ error: "Empty response" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ example }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-example failed", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
