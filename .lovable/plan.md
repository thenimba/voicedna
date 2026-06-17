# AI Voice Profile Analysis

Today the Completion screen only dumps raw Q&A into a markdown file (in whatever language the user answered). The user wants the AI to actually **analyze** those answers against the Taste Interviewer framework and produce a polished, English voice-profile document plus a ready-to-paste system prompt.

## What gets built

### 1. New edge function — `supabase/functions/analyze-voice-profile/index.ts`
- Input: `{ userName, qaPairs: [{ category, question, answer, isFollowUp }] }`
- Calls Lovable AI Gateway (`google/gemini-2.5-pro` for quality) via the AI SDK pattern already used by `generate-example`.
- System prompt instructs the model to:
  - Read all Q&A (answers may be mixed Hebrew/English) and **write the entire output in English**.
  - Follow the structure from `docs/taste-interviewer-prompt.md`:
    - `# VOICE PROFILE: <name>` + 2–3-sentence **Core Identity**
    - 7 thematic sections (Beliefs, Writing Mechanics, Aesthetic Crimes, Voice & Personality, Structural Preferences, Hard Nos, Red Flags) — synthesized analysis, not a raw Q&A dump
    - **Quick Reference Card** (Always / Never / Signature Phrases / Voice Calibration)
    - **Anti-Overfitting Guide** with the filled-in "What Matters Most" 3 items
  - Append a new final section **`## RECOMMENDED SYSTEM PROMPT`** containing a fenced code block — a drop-in system prompt embodying the user's voice DNA, ready to paste into Claude/ChatGPT/Gemini.
  - Translate any Hebrew quotes used as examples and keep the original in parentheses when useful.
- Returns `{ markdown: string }`. CORS + Zod input validation + 429/402 handling.

### 2. Update `src/pages/Completion.tsx`
- Add a primary action **"Generate AI Voice Profile"** (alongside the existing raw download, which becomes secondary "Download raw transcript").
- On click: call the edge function with `state.userName` + `state.qaPairs`, show a loading state in the existing button, then trigger a browser download of `<name>-voice-profile.md`.
- Cache the generated markdown in component state so repeated downloads don't re-bill; add a small "Regenerate" link.
- Surface gateway errors (rate limit / credits) via toast.
- i18n strings added to `src/lib/i18n/en.ts` and `he.ts` (button label, loading, error, success).

### 3. No schema / auth / RLS changes
The edge function is stateless — it reads input from the request body only.

## Technical notes
- Reuse the gateway helper pattern from `supabase/functions/generate-example/index.ts` (`createLovableAiGatewayProvider`, `streamText`/`generateText`).
- Use `generateText` (non-streaming) — output is one document; simpler UX with a single loading state.
- `stopWhen` not needed (no tools).
- Token budget: 126 Q&A pairs ≈ ~15–25k input tokens; Gemini 2.5 Pro handles this comfortably. Output capped via prompt ("aim for 1500–2500 words").
- Keep `LOVABLE_API_KEY` server-side (already configured).

## Out of scope
- Storing the generated profile in the database (can be added later if the user wants history).
- Auto-running analysis on completion — kept user-triggered to control cost.
