## Fix: Hebrew Noto Sans not applied to questions, sidebar, and headlines

### Why it's still serif/italic
My previous CSS override targeted `.font-serif`, `h1`–`h4`, and `em`/`i`. But every headline, question bubble, and sidebar label in this app uses a custom class `font-serif-question` plus Tailwind's `italic` utility — neither of which my selector caught. The QuestionBubble, InterviewSidebar items, Onboarding/Landing/Completion/Auth headlines, and ExampleHint body all fall through to Lora italic.

### Change (single file: `src/index.css`)
Extend the `html[lang="he"]` block to also override:

- `.font-serif-question` → `'Noto Sans Hebrew', system-ui, sans-serif`, weight 500, normal style
- Tailwind's `.italic` utility when nested under `html[lang="he"]` → `font-style: normal` (italic looks bad in Hebrew and Noto Sans Hebrew has no italic cut); compensate with `font-weight: 600` so the "emphasized word" still reads as emphasis
- Keep the amber follow-up question visually distinct via color only (already handled by `text-vd-amber`), no italic needed

No component, Tailwind config, or i18n changes required — pure CSS, scoped to `html[lang="he"]`, so English is untouched.

### Verification
After the edit, reload `/interview` in Hebrew and confirm:
1. Sidebar category names render in Noto Sans Hebrew (not serif)
2. Question bubble text is upright Noto Sans Hebrew, no italic slant
3. Follow-up (amber) questions are upright, still amber-colored
4. Onboarding / Landing / Completion / Auth headlines use Noto Sans Hebrew
5. English (toggle back) is unchanged — still Lora italic where designed
