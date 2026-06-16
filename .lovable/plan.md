# Add Hebrew (RTL) Support

Add a Hebrew locale alongside English with a top-bar toggle. Hebrew flips the entire app to RTL and translates all UI chrome plus the 100 interview questions, category names, follow-up pushbacks, and onboarding copy.

## Scope

In:
- EN / עב toggle pill in the PageFrame top bar (persisted in `localStorage` as `voicedna.lang`)
- `<html lang>` and `<html dir>` flip live on change
- All UI chrome strings translated (Landing, Onboarding, Interview chrome, Completion, Auth, SyncIndicator, InputArea, sidebar, marginalia, status footer, buttons, toasts)
- All 100 interview questions + 7 category names + follow-up pushback lines translated to Hebrew
- Tailwind RTL-aware spacing/borders on the few asymmetric components (sidebar border, QuestionBubble left rule, InputArea hints)

Out:
- No language detection from browser (manual toggle only, default English)
- No translation of stored answers, session codes, or .md export content
- No translation of `/docs` markdown
- No AI/runtime translation — all strings are static dictionaries

## Approach

Lightweight in-house i18n — no extra library — to keep bundle small and match existing minimal stack.

1. `src/lib/i18n/types.ts` — `Lang = "en" | "he"`, `Dictionary` shape
2. `src/lib/i18n/en.ts` and `src/lib/i18n/he.ts` — full string dictionaries:
   - `ui.*` — every visible label, button, placeholder, status, marginalia
   - `categories.<id>` — translated category names (ids stay stable in storage)
   - `questions.<categoryId>[]` — Hebrew translations index-aligned with English
   - `followUps[]` — translated pushback lines
3. `src/lib/i18n/index.ts` — `LangProvider` context + `useT()` hook returning `{ t, lang, setLang, dir }`. On mount and on `setLang`, sets `document.documentElement.lang` and `dir`. Persists to `localStorage`.
4. `src/components/LangToggle.tsx` — small EN / עב pill, mono-label styling, placed in `PageFrame` header next to the room tag.
5. Wrap `<App />` in `<LangProvider>` in `src/main.tsx`.
6. Refactor `src/lib/questions.ts`:
   - Keep `CATEGORIES` ids/counts/icons as the source of truth
   - Move all English strings into `en.ts`
   - Add `getQuestion(categoryId, index, lang)` and `getCategoryName(id, lang)` helpers used by the interview store
   - `INITIAL_QUESTIONS` becomes a per-language lookup
7. Update `interview-store.ts` selector that picks the current question to read from the active language dictionary (question text in `qaPairs` is captured at submit time in whatever language the user saw — that snapshot stays as-is).
8. Update each page/component to use `t(...)` for hardcoded strings.
9. RTL polish:
   - Add `dir="rtl"` aware utility classes where order matters (`flex-row-reverse` only where the asymmetric editorial layout demands it — Landing 7/5 grid keeps reading order, just text-aligns right)
   - `QuestionBubble` border-left becomes border-right in RTL (`rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-6`)
   - `InterviewSidebar` right border becomes left border in RTL
   - Arrow icons (`ArrowRight`) flip via `rtl:rotate-180` on the icon

## Technical Notes

```
src/lib/i18n/
  ├── types.ts        // Lang, Dictionary
  ├── en.ts           // English dictionary (source of truth, mirrors current copy)
  ├── he.ts           // Hebrew translations (index-aligned)
  └── index.ts        // LangProvider, useT(), <html dir/lang> sync

src/components/LangToggle.tsx
```

- Storage key: `voicedna.lang` (default `"en"`)
- Tailwind already supports `rtl:` variants in v3 — no config change needed
- `qaPairs[].question` keeps whatever language was shown at submit time, so changing language mid-interview doesn't rewrite history
- Category `id` stays English in DB/localStorage; only the displayed `name` is translated

## Out of Scope

- Hebrew translations of the exported `.md` voice file
- Translating the `/docs` markdown files
- Hebrew error messages from Supabase auth (those come from the backend)
- Date/number formatting (not currently displayed)
