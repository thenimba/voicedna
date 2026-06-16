# The "Taste Interviewer": Ruben Hassid's 100-question brain-duplication framework

The framework you're looking for isn't from "how-to-guide.ai" — **that domain doesn't exist**. The actual source is **how-to-ai.guide**, a landing page for Ruben Hassid's "How to AI" Substack newsletter (382K+ subscribers, #1 in Education on Substack). The framework, called **"The Taste Interviewer,"** was published on **January 21, 2026** in his article *"I am just a text file."* It instructs Claude to conduct exactly **100 questions** across 7 categories, generating a portable markdown voice profile. The questions are not pre-written — the prompt defines 7 category areas with topic guidance, and Claude dynamically generates specific questions during a live interview. Below is the complete, verified framework.

---

## The complete "Taste Interviewer" prompt, verbatim

The full prompt uses XML tags and is designed for Claude (optimized for Opus-4.5 via Claude's Cowork tab). Here is the verified text reconstructed from Hassid's Substack article and corroborated by two independent Cybercorsairs.com reconstructions:

```
You are a Taste Interviewer — a relentless interviewer whose job is to extract 
the DNA of how I think, write, and see the world. Your goal is to create a 
comprehensive document that captures my unique voice so precisely that another 
Claude instance could write and think exactly like me.

<interview_philosophy>

You're not here to be polite. You're here to get to the truth. Most people 
can't articulate their own taste — they give vague, socially acceptable answers. 
Your job is to break through that.

</interview_philosophy>

<interview_structure>

Conduct 100 questions total across these categories (not necessarily in order — 
follow the thread when something interesting emerges):

BELIEFS & CONTRARIAN TAKES (15 questions)
- What I believe that others in my field don't
- Hot takes I'd defend to the death
- Conventional wisdom I think is wrong

WRITING MECHANICS (20 questions)
- How I actually write (not how I think I write)
- My default sentence structures
- How I open pieces / How I close them
- My relationship with punctuation, formatting, line breaks
- Words I overuse / Words I love / Words I'd never use

AESTHETIC CRIMES (15 questions)
- What makes me cringe in other people's writing
- Specific phrases or patterns that feel like nails on a chalkboard
- Types of content I find lazy or uninspired

VOICE & PERSONALITY (15 questions)
- How I use humor (if at all)
- My tone when I'm being serious vs. casual
- How I handle disagreement or controversy
- What I sound like when I'm excited vs. skeptical

STRUCTURAL PREFERENCES (15 questions)
- How I organize ideas
- My relationship with lists, headers, bullets
- How I handle transitions
- My default content structures

HARD NOS (10 questions)
- Things I'd never write about
- Approaches I'd never take
- Lines I won't cross

RED FLAGS (10 questions)
- What makes me immediately distrust a piece of content
- Signals that someone doesn't know what they're talking about

</interview_structure>

<interview_rules>

1. ONE question at a time. Wait for my response before moving on.
2. Push back on vague answers. If I say "I like to keep things simple," ask 
   "Simple how? Give me an example of simple done right and simple done lazy."
3. Ask for specific examples. "Show me a sentence you've written that captures 
   this."
4. Call out contradictions. If I said one thing earlier and something different 
   now, point it out.
5. Go deeper on interesting threads. If something unusual emerges, follow it.
6. Don't accept "I don't know" easily. Try reframing the question or approaching 
   from another angle.

</interview_rules>

<output_requirements>

After exactly 100 questions, compile everything into a comprehensive markdown 
document. This is NOT a summary — it's a complete reference document preserving 
the full depth of every answer.

Structure it like this:

# VOICE PROFILE: [My Name]

## Core Identity
[2-3 sentences capturing the essence — this is the only summary section]

---

## SECTION 1: BELIEFS & CONTRARIAN TAKES

### Q1: [The question you asked]
[My full answer, preserved verbatim or lightly cleaned up for clarity]

### Q2: [The question you asked]
[My full answer]

[Continue for all questions in this category]

---

## SECTION 2: WRITING MECHANICS

### Q16: [The question you asked]
[My full answer]

[Continue for all questions in this category]

---

## SECTION 3: AESTHETIC CRIMES
[Same format — question, then full answer]

---

## SECTION 4: VOICE & PERSONALITY
[Same format]

---

## SECTION 5: STRUCTURAL PREFERENCES
[Same format]

---

## SECTION 6: HARD NOS
[Same format]

---

## SECTION 7: RED FLAGS
[Same format]

---

## QUICK REFERENCE CARD

### Always:
[Extracted from answers — specific patterns to follow]

### Never:
[Extracted from answers — specific things to avoid]

### Signature Phrases & Structures:
[Actual examples I provided during the interview]

### Voice Calibration:
[Key quotes from my answers that capture tone]

---

## HOW TO USE THIS DOCUMENT (ANTI-OVERFITTING GUIDE)

This document captures my taste — it is NOT a checklist to follow rigidly.

### Spirit Over Letter
The goal is to internalize my sensibility, not to mechanically apply every 
pattern. A piece that uses 3 of my tendencies naturally will always beat a piece 
that forces in 10 of them awkwardly.

### Frequency Guidance
For each tendency documented above, I've noted whether it's:
- **HARD RULE** — Never violate (these are rare — usually in the "Never" section)
- **STRONG TENDENCY** — Do this 70-80% of the time, but breaking it occasionally 
  is fine
- **LIGHT PREFERENCE** — Nice to have, but context determines when to apply

When no label exists, assume it's a LIGHT PREFERENCE.

### Context Matters
My voice adapts to format:
- A tweet ≠ a newsletter ≠ a LinkedIn post ≠ a long-form article
- Use judgment about which patterns fit which format
- Some of my tendencies are format-specific — I noted when this applies

### Natural Variation
Real writers aren't perfectly consistent. Introduce natural variation:
- Don't start every piece the same way just because I have a "signature open"
- Don't avoid a word forever just because I said I dislike it — sometimes it's 
  the right word
- Let the content dictate structure, not the template

### The Litmus Test
Before finalizing anything written "as me," ask:
> "Does this sound like something I would actually write — or does it sound like 
> an AI trying very hard to imitate me?"
If it feels forced, pull back. Less imitation, more inhabitation.

### What Matters Most
If you forget everything else, remember these 3 things:
1. [To be filled: My single most important belief about writing]
2. [To be filled: The one pattern that makes my voice mine]
3. [To be filled: The #1 thing I never do]

Everything else is secondary.

---

## INSTRUCTIONS FOR CLAUDE

When writing as [My Name], reference this document. Pay attention to:
1. The specific examples I gave — use similar structures
2. The words and phrases I said I hate — never use them
3. The beliefs I hold — let them inform the angle
4. My actual sentences — match the rhythm and length

This document is a source of truth, not a suggestion. But apply it with 
judgment, not rigidly.

</output_requirements>

Begin by asking me your first question.
```

**Important note**: Hassid stated on his Substack Notes that he "couldn't paste the entire prompt" in one post, meaning the version in the full Substack article may contain additional sections beyond what was extractable. Paid subscribers also receive his personal completed `.md` voice file as a downloadable template.

---

## The 7 categories and their 100-question allocation

The framework distributes **exactly 100 questions** across seven categories. The questions themselves are generated dynamically by Claude during the interview — the prompt provides topic areas, not pre-written question lists. This is intentional: the AI follows conversational threads and pushes back on vague answers, making each interview unique.

| # | Category | Questions | What Claude explores |
|---|----------|:---------:|----------------------|
| 1 | **Beliefs & Contrarian Takes** | 15 | Field-specific beliefs others don't hold; hot takes you'd defend to the death; conventional wisdom you reject |
| 2 | **Writing Mechanics** | 20 | How you actually write vs. how you think you write; default sentence structures; how you open and close pieces; punctuation and formatting habits; words you overuse, love, or would never use |
| 3 | **Aesthetic Crimes** | 15 | What makes you cringe in others' writing; specific nails-on-chalkboard phrases; content types you find lazy or uninspired |
| 4 | **Voice & Personality** | 15 | How you use humor; serious vs. casual tone differences; how you handle disagreement; what you sound like excited vs. skeptical |
| 5 | **Structural Preferences** | 15 | How you organize ideas; relationship with lists, headers, and bullets; transition handling; default content architectures |
| 6 | **Hard Nos** | 10 | Topics you'd never write about; approaches you'd never take; lines you won't cross |
| 7 | **Red Flags** | 10 | What makes you immediately distrust content; signals that someone doesn't know what they're talking about |

The design philosophy is inverted: **80% of the resulting voice file consists of what you do NOT do.** Hassid's signature insight — "Taste isn't what you like, but what you reject" — drives the heavy weighting toward Aesthetic Crimes, Hard Nos, and Red Flags. Combined, those three "negative" categories account for **35 of the 100 questions**.

---

## The 6 interview rules that make this framework work

The framework's power lies not in the categories but in how Claude is instructed to conduct the interview. Six rules transform it from a passive questionnaire into an adversarial extraction process:

1. **One question at a time.** Wait for the full response before proceeding — no batching or rushing.
2. **Push back on vague answers.** If you say "I like to keep things simple," Claude must ask: *"Simple how? Give me an example of simple done right and simple done lazy."*
3. **Demand specific examples.** Claude insists: *"Show me a sentence you've written that captures this."*
4. **Call out contradictions.** If you said one thing in question 12 and the opposite in question 47, Claude flags it.
5. **Follow interesting threads.** When something unusual emerges, Claude abandons the category sequence and digs deeper.
6. **Refuse to accept "I don't know."** Claude reframes the question from a different angle rather than moving on.

As Cybercorsairs' analysis noted, the contradiction-calling rule is the most clever design choice: *"We all have contradictions in how we think we write versus how we actually write. That tension, once captured, is what makes a voice profile feel alive rather than robotic."*

---

## Ruben Hassid — the creator behind the framework

**Ruben Hassid** is a French-born AI educator and entrepreneur based in Tel Aviv, Israel. He founded **EasyGen**, an AI-powered LinkedIn content generation platform, and writes the **"How to AI"** Substack newsletter — currently the **#1 Education newsletter on Substack** with **382,000+ subscribers** (roughly 2,000 paid). His tagline: *"Master AI before it masters you."*

His professional trajectory is unusual: he learned English at age 9 writing video game blogs, ran two techno music labels that accumulated millions of YouTube plays, worked as International Social Media Manager at Trade Republic (fintech), then pivoted fully to AI content creation after ChatGPT launched in late 2022. He holds a bachelor's in business administration and a master's in digital marketing, with studies at Sungkyunkwan University in Seoul.

**Platform presence as of early 2026:**

- **LinkedIn**: ~770,000 followers, 200M+ views, consistently one of the top AI voices on the platform
- **Substack**: 382K+ subscribers, ~300K weekly email opens, ~$33K MRR from EasyGen
- **X/Twitter**: @rubenhassid — 47.9K followers
- **Website**: rubenhassid.ai (prompt library, $39 one-time purchase)
- **how-to-ai.guide** — the landing page you likely encountered, which redirects to his Substack and Notion resources

He has keynoted in front of **60,000 people** in Los Angeles, spoken at PSG Stadium in Paris, been invited by French President Macron for an AI conference, and consulted for Fortune 500 companies. His Synthesia AI avatar content has surpassed **60M video views**. He generates approximately **$1M annually** via LinkedIn through SaaS, courses, sponsorships, and keynotes.

---

## Community reconstructions and similar voice-cloning frameworks

The Taste Interviewer framework has spawned reproductions and inspired parallel approaches across the AI content ecosystem.

**Direct reconstructions of Hassid's framework** have appeared on Cybercorsairs.com in two detailed articles. The first, *"Master Your AI Voice: The 'Taste Interviewer' Method"* (January 23, 2026), analyzed why each category works and highlighted the inversion principle — instead of prompting the AI, the AI prompts you. The second, *"Claude Voice Clone Prompt: Make AI Write Like You"* (March 10, 2026), provided the most complete reproduction including practical guidance: block **60–90 minutes** (Hassid says it takes roughly **2 hours**), share real writing samples when asked, keep separate profiles for different contexts, and test the output immediately. A UX designer published *"I Spent Two Hours Teaching AI How to Be Me"* on UX Adjacent's Substack, documenting the full experience and noting that "the real insights came not from my descriptions of my voice, but Claude comparing what I actually wrote to what AI had been writing for me."

**No Reddit threads, YouTube walkthroughs, or dedicated X/Twitter threads** reproducing the full 100-question framework were found. Community discussion remains concentrated on LinkedIn (where Hassid's posts reach millions) and Substack ecosystems.

**Similar but distinct frameworks** exist from other creators. Tiago Forte's **AI Style Guide Method** takes the opposite approach: feed 4–6 writing samples to ChatGPT and ask it to analyze voice, tone, diction, and structure automatically, rather than answering questions. **The CAIO** published a framework in 2026 that feeds 5–10 writing samples to Claude Code and leverages Claude's built-in Custom Styles feature. **Writing for Developers** on Substack created an XML-structured voice profile system requiring 3+ writing samples uploaded to Claude. Justine Moore at a16z published **"Export Your Brain"** (October 2024), a conceptual framework for AI brain-exporting covering self-understanding, communication, and application integration. Mark Schaefer documented the experience of having an **unauthorized AI clone ("MarkBot")** built from his published work, rating it "90% great" but missing personal stories and humor — illustrating exactly the gap Hassid's interview process is designed to fill.

---

## How to use the framework in practice

Hassid's recommended workflow is straightforward. Open **Claude** (specifically the Cowork tab with Opus-4.5). Paste the complete prompt above. Answer all 100 questions honestly — Hassid emphasizes using **Wispr Flow** voice dictation because *"typing makes you edit; talking makes you honest."* After the interview, Claude compiles a comprehensive markdown document. Save it as a `.md` file.

The resulting voice file is **fully portable**. Upload it to ChatGPT (Projects feature), Claude, Gemini, Grok, or any other AI. Begin every prompt with: *"Read [your_name].md first. Then [whatever you need]."* The file should be **updated regularly** — upload the old version, have Claude interview you on new topics or evolved opinions, add new categories, and redownload.

Hassid's own examples of what his voice file contains illustrate the required specificity:

- Never start with "In today's fast-paced world..."
- Never use "utilize," "leverage," or "synergy"
- No paragraphs longer than 3 sentences
- No hedging with "I think" or "perhaps" or "it seems"
- Never end with summaries of what was just said
- Writes "like explaining something to a smart friend who's slightly impatient and will stop reading if I waste their time with throat-clearing"

The framework's anti-overfitting system uses three tiers — **HARD RULE** (never violate), **STRONG TENDENCY** (follow 70–80% of the time), and **LIGHT PREFERENCE** (context-dependent) — ensuring the AI captures your voice without becoming a rigid caricature.

## Conclusion

The "100 questions to duplicate your brain into AI" framework is Ruben Hassid's **"Taste Interviewer"** prompt, published January 21, 2026 on his "How to AI" Substack. The domain confusion stems from **how-to-ai.guide** (his landing page) being misremembered as "how-to-guide.ai." The 100 questions are not pre-written — they are dynamically generated by Claude across 7 defined categories during a live adversarial interview. The complete prompt, output template, and anti-overfitting guide are reproduced in full above. The framework's core innovation is a double inversion: the AI interviews you (not the reverse), and the emphasis falls on what you reject rather than what you like. As Hassid put it: *"I am just a markdown file. And so are you. The only question is whether you'll have the courage to write yourself down."*