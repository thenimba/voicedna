# VoiceDNA — Docs Archive + Full-App Redesign Program

## Part 1 — Archive source docs

Create `docs/` and move the five uploaded reference files in, so the design system and the Taste Interviewer prompt live alongside the code.

```
docs/
  taste-interviewer-framework.md      ← compass_artifact_wf-…md
  taste-interviewer-prompt.md
  DESIGN.md                           ← voicedna-DESIGN.md
  lovable-prompt.md                   ← voicedna-lovable-prompt.md
  reference-home.html                 ← voicedna-home.html
```

Add a one-page `docs/README.md` index that points to each file and labels them: *spec*, *prompt*, *reference HTML*.

## Part 2 — Redesign program (full app)

Scope: **Landing, Onboarding (3 steps), Interview screen, Completion**. Locked taste (your picks):

- **Palette**: DESIGN.md tokens verbatim (`--vd-paper #F7F6F2`, `--vd-surface #FFFFFF`, `--vd-t1 #18181B`, `--vd-accent #1D4ED8`, amber/green semantic states).
- **Typography**: DESIGN.md pairing — Lora (serif questions/headlines) + DM Sans (UI/body) + JetBrains Mono (labels/data).
- **Layout family**: Magazine — asymmetric grids, mixed typographic scales, editorial pacing.

These are hard constraints across every direction. Variation lives in composition, density, hierarchy, and motion register only.

### Step 1 — Capture current state
Already captured: full-page screenshot of `/` (the current landing). Onboarding, Interview, and Completion will be captured per-screen before generating directions for each, so directions anchor on real UI rather than imagination.

### Step 2 — Generate 3 directions per surface
For each of the 4 surfaces, call `design--create_directions` with the surface screenshot + the locked tokens/type/layout. Each surface gets 3 rendered HTML directions that differ only along these axes:

| Direction | Sensory metaphor | Energy | Structural move |
|---|---|---|---|
| **A — Broadsheet** | Front page of a Sunday paper | Quiet, authoritative | Wide masthead, oversized serif headline, narrow lead column, mono dateline rails |
| **B — Galley Proof** | Editor's marked-up manuscript | Working, intimate | Off-grid pull quotes, marginalia in mono, hairline rules, ink-corrected accents |
| **C — Issue №** | Indie print magazine | Confident, graphic | Numbered section chrome, oversized category numerals, asymmetric two-column with bleed cards |

### Step 3 — Pick a single direction (one pick, applied everywhere)
After Landing directions render, present them as a `prototype` question: *"Which direction should I build?"* The chosen direction (A/B/C) is then carried as the structural template through Onboarding, Interview, Completion — same hero alignment, same component counts, same density, same motion register.

If you'd rather pick per-surface (e.g. Broadsheet for Landing, Galley for Interview), say so before Step 3 and the plan adjusts to 4 separate pickers.

### Step 4 — Implementation pass
Once a direction is chosen:

1. **Tokens** — confirm `src/index.css` + `tailwind.config.ts` match DESIGN.md exactly; fix any drift. Add any new semantic tokens introduced by the direction (e.g. `--vd-rule`, `--vd-marginalia`).
2. **Type system** — register Lora / DM Sans / JetBrains Mono via Google Fonts in `index.html`; expose `font-serif-question`, `font-sans`, `font-mono-label`, `font-mono-data` utilities.
3. **Landing** (`src/pages/Landing.tsx`) — rebuild hero per chosen direction; keep pyramid + waveform motifs (per project memory).
4. **Onboarding** (`src/pages/Onboarding.tsx`) — restyle the 3 steps as numbered "Stages" with magazine chrome; keep state logic untouched.
5. **Interview** (`src/pages/Interview.tsx` + `components/interview/*`) — restyle sidebar, top bar, question bubble (serif), pushback state (amber), user answer (sans), input area. Behavior and store stay as-is.
6. **Completion** (`src/pages/Completion.tsx`) — restyle as a "published issue" page with waveform sigil and download CTA.
7. **Mobile** — collapse magazine grid to single column; sidebar becomes horizontal progress dots (per memory).
8. **QA** — full-page screenshot of each redesigned surface at desktop + mobile widths; verify against direction prototype.

### Out of scope
- Wiring Gemini / Lovable AI (still mock).
- Auth, database persistence.
- Dark mode toggle (DESIGN.md marks it optional).
- Any change to the interview store or question dataset.

### Deliverables
- `docs/` populated and indexed.
- Three rendered direction previews for Landing (clickable).
- After your pick: redesigned Landing → Onboarding → Interview → Completion, mobile-responsive, tokens centralized.
