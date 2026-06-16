## Goal

Help users who get stuck on a question by letting them reveal a short, AI-generated example answer in the current language (EN or HE). The example is generated on demand, cached per question for the session, and shown beneath the question bubble.

## UX

- A small mono-label link `Show example` / `הראה דוגמה` appears beneath the current `QuestionBubble` (not on stale/recent ones).
- Click → inline italic example block fades in beneath the question, prefixed `EXAMPLE` / `דוגמה`. Marked clearly as a sample, not a suggested answer to copy.
- While loading: link text swaps to `Thinking…` / `חושב…` and is disabled.
- After it appears: a `Hide` link toggles it away. Once generated, re-toggling is instant (cached).
- On error (429 credits, 402, network): show one-line amber error under the link, no toast spam.
- Not shown for follow-up pushback questions (they're already conversational).
- Examples are session-only (in-memory map keyed by `${categoryId}:${index}:${lang}`); not persisted, not synced.

## Architecture

1. **Edge function** `supabase/functions/generate-example/index.ts`
   - Public (no JWT required), CORS enabled.
   - Body: `{ question: string, category: string, lang: "en" | "he" }`.
   - Calls Lovable AI Gateway via `@ai-sdk/openai-compatible` with `google/gemini-3-flash-preview` using the shared gateway helper pattern.
   - System prompt: "You are helping a writer answer a self-reflection interview question about their writing taste. Produce ONE short (40–70 words) first-person example answer in {lang}. It should sound like a thoughtful but informal human, specific not generic, and clearly an example — not a template. No preamble, no quotes, no markdown."
   - Returns `{ example: string }`. Handles 429/402 by returning `{ error, status }`.
   - Shared helper: `supabase/functions/_shared/ai-gateway.ts` (the standard `createLovableAiGatewayProvider`).

2. **Client hook** `src/lib/use-example.ts`
   - `useExample()` returns `{ example, loading, error, show, hide, visible }`.
   - Keeps a module-level `Map<string, string>` cache.
   - Calls the edge function via `supabase.functions.invoke("generate-example", { body })`.

3. **UI** new component `src/components/interview/ExampleHint.tsx`
   - Mono-label toggle link + italic example block in `bg-vd-cream/40 border-l border-vd-border` styling, mirrored for RTL (matches `QuestionBubble` direction logic).
   - Receives `question`, `categoryId`, `questionIndex`, `lang`.

4. **Wire into `Interview.tsx`**
   - Render `<ExampleHint />` directly beneath the current `QuestionBubble` (inside the `animate-fade-in` block), only when `!state.isFollowUp`.
   - Reset visibility automatically when the question changes (component keyed by `${categoryId}:${index}`).

5. **i18n strings** add to `src/lib/i18n/en.ts` and `he.ts`:
   - `iv.example.show`, `iv.example.hide`, `iv.example.loading`, `iv.example.label`, `iv.example.error`

## Out of scope

- Persisting examples across sessions or syncing to Cloud.
- Per-question hand-written examples (chose AI-on-demand).
- Example button on completion screen / pushback follow-ups.
- Rate-limiting / abuse protection beyond what the gateway already enforces.

## Files

Created:
- `supabase/functions/generate-example/index.ts`
- `supabase/functions/_shared/ai-gateway.ts` (if not already present)
- `src/lib/use-example.ts`
- `src/components/interview/ExampleHint.tsx`

Edited:
- `src/pages/Interview.tsx` (mount `ExampleHint` under current question)
- `src/lib/i18n/en.ts`, `src/lib/i18n/he.ts` (5 new keys)
- `supabase/config.toml` (register function, `verify_jwt = false`)
