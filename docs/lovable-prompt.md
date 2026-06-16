# Lovable Prompt: AI Avatar Builder App

---

## PROMPT

Build a web app called **"VoiceDNA"** — a guided interview tool that helps people build their personal AI voice profile (a `.md` file they can upload to any AI to make it sound exactly like them).

---

### CONCEPT

The app conducts a structured 100-question interview across 7 categories. After completion, it generates a downloadable markdown voice profile. Think: part onboarding wizard, part journaling app, part AI trainer.

---

### TECH STACK

- React + TypeScript
- Tailwind CSS
- Shadcn/ui components
- Supabase (auth + database for saving progress)
- Claude API (claude-sonnet-4-20250514) for dynamic question generation and pushback
- No backend required beyond Supabase

---

### CORE SCREENS

**1. Landing / Intro Screen**
- Headline: "Teach AI to think like you."
- Subheadline: "Answer 100 questions. Download your voice. Upload it to any AI — forever."
- CTA: "Start Your Interview"
- Show a visual pyramid: "AI becomes you → Your .md file → 100 questions"
- Minimal, clean, light mode — warm off-white paper background (`#F7F6F2`)

**2. Onboarding (3 steps)**
- Step 1: Enter your name (used in the final profile)
- Step 2: Choose interview mode:
  - **Focused** (30–45 min): Follows the category order strictly
  - **Conversational** (60–90 min): Claude follows threads, goes deeper
- Step 3: Brief explainer of what happens — "Claude will interview you, push back on vague answers, and compile your voice file at the end. Be honest. Be specific."

**3. Interview Screen (the main screen)**

Layout:
- Left sidebar: Category progress tracker (7 categories, question count per category, % complete)
- Center: The conversation interface
  - Claude's question appears as a styled "interviewer" bubble
  - User types (or voice inputs) their answer in a text area below
  - "Submit Answer" button
  - Optional: "Skip (I'll come back)" button
- Top bar: Question counter "Question 23 / 100" + category label "Writing Mechanics"
- Subtle progress bar at the top

Behavior:
- Each answer is sent to Claude API with the full conversation history
- Claude responds with either: a follow-up pushback, a request for a specific example, OR moves to the next question
- Claude decides when to move on (after a satisfactory answer or max 2 follow-ups)
- All answers are saved to Supabase in real-time (autosave)
- User can close and resume from where they left off (auth required)

Claude system prompt for the interview (use this exactly):
```
You are a Taste Interviewer. Your job is to extract the voice DNA of the person you're interviewing. You are conducting a 100-question interview across 7 categories. 

The 7 categories and their question counts are:
1. Beliefs & Contrarian Takes (15 questions)
2. Writing Mechanics (20 questions)  
3. Aesthetic Crimes (15 questions)
4. Voice & Personality (15 questions)
5. Structural Preferences (15 questions)
6. Hard Nos (10 questions)
7. Red Flags (10 questions)

Rules:
- Ask ONE question at a time
- Push back on vague answers (max 2 follow-ups per question before moving on)
- Request specific examples when answers are abstract
- Call out contradictions with earlier answers
- Follow interesting threads when they emerge
- Never accept "I don't know" without trying a reframe

Current interview context will be passed to you. Generate the next question or follow-up based on the conversation so far. Respond ONLY with the question or follow-up — no preamble, no "Great answer!", no filler.

When you determine a question has been answered sufficiently, respond with:
NEXT_QUESTION: [your next question here]

When pushing back or asking for more, respond with:
FOLLOW_UP: [your follow-up here]
```

**4. Completion Screen**
- Triggered after question 100
- Show: "Interview complete. Compiling your voice profile..."
- Loading animation (5–10 seconds) while Claude API generates the full `.md` document
- Then: "Your Voice DNA is ready."
- Two CTAs:
  - **"Download [name].md"** — downloads the compiled markdown file
  - **"Preview Profile"** — opens a modal showing the formatted profile

**5. Profile Preview Modal**
- Renders the markdown with proper formatting
- Shows: all 7 sections with Q&A pairs, Quick Reference Card, Anti-Overfitting Guide
- Copy to clipboard button
- Download button

**6. Dashboard (for returning users)**
- List of completed profiles (date, name)
- Option to start a new interview
- Option to re-download past profiles
- "Update Profile" — starts a shorter follow-up interview (20 questions) on topics that may have evolved

---

### PROFILE GENERATION PROMPT (used after question 100)

After the interview, send this to Claude API with the full Q&A as context:

```
Based on the interview transcript provided, compile a comprehensive voice profile markdown document. 

Structure it exactly like this:

# VOICE PROFILE: [Name]

## Core Identity
[2-3 sentences capturing the essence of their voice]

---

## SECTION 1: BELIEFS & CONTRARIAN TAKES
[For each question in this category:]
### Q[number]: [The question asked]
[Their answer, verbatim or lightly cleaned for clarity]

[Repeat for all 7 sections]

---

## QUICK REFERENCE CARD

### Always:
[Bullet list of specific patterns to follow, extracted from answers]

### Never:
[Bullet list of specific things to avoid, extracted from answers]

### Signature Phrases & Structures:
[Actual examples they provided during the interview]

### Voice Calibration:
[3-5 key quotes from their answers that best capture their tone]

---

## ANTI-OVERFITTING GUIDE

### Spirit Over Letter
[1 paragraph customized to their specific voice tendencies]

### The 3 Things That Matter Most
1. [Their single most important writing belief]
2. [The one pattern that makes their voice unique]
3. [The #1 thing they would never do]

---

## HOW TO USE THIS FILE

Start every AI session with: "Read [name].md first. Then [your task]."
Update this file every 3-4 months as your voice evolves.
This file works with Claude, ChatGPT, Gemini, Grok, and any other AI.
```

---

### UI/UX NOTES

> **Source of truth**: `voicedna-DESIGN.md` governs all visual decisions. When in conflict, DESIGN.md wins over anything in this prompt.

---

#### Concept: "The Interview Room"
The interface should feel like sitting in a quiet, well-lit room across from a sharp journalist. Purposeful. Unhurried. The kind of place where you give honest answers. **Design references**: Linear (precision), Notion (clarity), The Atlantic (editorial authority).

---

#### Mode
- **Light mode is the default** — warm, editorial, focused
- Dark mode is a user toggle (Settings), not the primary experience
- Never use dark backgrounds on primary surfaces

---

#### Color Tokens (CSS variables — define these globally)

```css
--vd-paper: #F7F6F2;         /* page background — warm off-white */
--vd-surface: #FFFFFF;        /* cards, sidebar, input areas */
--vd-border: #E3E1D9;         /* default borders — warm, not gray */
--vd-border-strong: #C8C5BD;  /* emphasized borders, focus states */
--vd-cream: #F5F3EE;          /* question bubble background */
--vd-t1: #18181B;             /* primary text */
--vd-t2: #52525B;             /* secondary — user answers */
--vd-t3: #A1A1AA;             /* tertiary — labels, hints */
--vd-accent: #1D4ED8;         /* CTA, active states, progress, question border */
--vd-accent-bg: #EFF6FF;      /* active category highlight */
--vd-accent-text: #1E40AF;    /* text on accent-bg surfaces */
--vd-amber: #92400E;          /* pushback text */
--vd-amber-bg: #FFFBEB;       /* pushback bubble bg */
--vd-amber-btn: #B45309;      /* submit button during pushback */
--vd-green: #059669;          /* auto-saved indicator, completed category */
--vd-green-bg: #ECFDF5;       /* completed category dot bg */
```

**Color rules:**
- Blue is reserved for Claude's questions and progress only
- Amber activates only during pushback — reverts to blue immediately on next question
- No purple, no gradients, no neon accents

---

#### Typography

Import from Google Fonts: `Lora` (serif), `DM Sans` (sans), `JetBrains Mono` (mono)

| Role | Font | Size | Weight |
|---|---|---|---|
| Interviewer questions | `Lora, Georgia, serif` | 16–18px | 400 |
| UI / answers / body | `DM Sans, system-ui` | 12–14px | 400 / 500 |
| Category labels / counters | `JetBrains Mono` | 10–12px | 400 |
| Completion headline | `Lora, Georgia, serif` | 26–28px | 400 |

**Critical rule**: Serif font on questions only. This is the single most important brand signal — it makes Claude's questions feel weighty and authoritative, not chatbot-like.

Text rendering rules:
- Question text: `font-style: normal` always — never italic
- Category labels: `letter-spacing: 0.06em; text-transform: uppercase`
- User answer text: `--vd-t2` (not full black) — softer than the interviewer voice
- Auto-save indicator: mono font — it's data, not conversation

---

#### Layout: Interview Screen

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar: 196px]  │ [Main content: flex-grow]               │
│                   │  Top bar: badge + Q counter             │
│  VoiceDNA logo    │  2px progress line                      │
│  ─────────────    │  ─────────────────────────────────────  │
│  ✓ Category 1     │  Conversation area (scrollable)         │
│  → Category 2     │    Previous Q&A (opacity: 0.55)         │
│  ○ Category 3..7  │    0.5px warm divider                   │
│                   │    Current question (Lora serif)        │
│                   │    Answer textarea OR user bubble       │
│                   │  ─────────────────────────────────────  │
│                   │  Input area (sticky bottom)             │
│                   │    [● auto-saved]  [Skip]  [Submit →]   │
└─────────────────────────────────────────────────────────────┘
```

Sidebar details:
- Width: `196px`, background `--vd-surface` (white, lighter than paper)
- Category icons: `15×15px` circles — ✓ done (green), → active (blue), ○ upcoming (empty)
- Active row: `--vd-accent-bg` fill, no border
- No section headers in sidebar

Top bar: `~42px` height, category badge left, Q counter right in mono font. Progress bar `2px` sits below the bar — not inside it.

Conversation area: `22px` padding, `14px` gap between elements. Previous question at `opacity: 0.55`.

Input area: `~80px`, sticky bottom, textarea `64px` min-height. Controls row: saved indicator left / skip + submit right.

---

#### Components

**Question Bubble** (interviewer):
```css
background: var(--vd-cream);
border-left: 2px solid var(--vd-accent);
border-radius: 0 8px 8px 0;  /* flat left, rounded right */
padding: 14px 16px;
font-family: Lora, Georgia, serif;
font-size: 16px;
line-height: 1.6;
```

**Pushback Bubble** (follow-up state):
```css
background: var(--vd-amber-bg);
border-left: 2px solid #F59E0B;
border-radius: 0 8px 8px 0;
color: var(--vd-amber);
font-size: 13px;
```

**User Answer Bubble** (past answers):
```css
background: var(--vd-surface);
border: 0.5px solid var(--vd-border);
border-radius: 8px;
margin-left: 20px;  /* indented — subordinate to the question */
color: var(--vd-t2);
font-size: 13px;
```

**Primary Button**:
```css
background: var(--vd-accent);  /* or --vd-amber-btn during pushback */
color: white;
border-radius: 6px;  /* NOT pill — sharp and professional */
padding: 7px 18px;
font-size: 12px;
font-weight: 500;
```
The submit button color MUST match the current bubble accent (blue default, amber during pushback).

**Progress Bar**:
```css
height: 2px;
background: var(--vd-border);  /* track */
/* fill: var(--vd-accent) */
transition: width 0.4s ease;
```
Never show the progress as a number — only as a fill bar.

**Auto-save Indicator**:
```
"● auto-saved" — 10px JetBrains Mono, color: --vd-green
```

**Completion Waveform**: 20 static vertical bars (heights 8–40px), `--vd-accent` fill at varying opacities (0.4–1.0 weighted by height). A visual metaphor for voice DNA — not a loader.

---

#### Screen States

| State | Bubble border | Submit button | Badge |
|---|---|---|---|
| Standard question | `--vd-accent` blue | `--vd-accent` blue | Blue on `--vd-accent-bg` |
| Pushback / follow-up | `#F59E0B` amber | `--vd-amber-btn` | Amber on `--vd-amber-bg` |
| Completion | — | — | Full-screen, no sidebar |

---

#### Motion Rules

| Element | Transition | Duration |
|---|---|---|
| New question appears | opacity 0 → 1 | 200ms ease |
| Progress bar fill | width | 400ms ease |
| Mode card selection | border-color | 150ms |
| Category state change | none (instant) | — |
| Pushback state shift | background on bubble | 200ms |

**Never animate:** category completion, question counter, auto-save indicator.

---

#### Responsive

- **Desktop ≥1024px**: Full sidebar + main layout
- **Tablet 768–1023px**: Sidebar collapses to `60px` icons only; hover tooltip shows category name
- **Mobile <768px**: Sidebar hidden → 7-dot horizontal progress strip at top; question text `15px`; mode cards stack vertically

---

#### Absolute Design Rules (never violate)

- Never use dark backgrounds on any primary surface in light mode
- Never use purple or gradient accents — blue only
- Never add cheerleading UI: no stars, no "Great job!", no confetti
- Never round sidebar category items — rectangular rows, not pills
- Never show progress as a percentage number
- Never use italic on question text

---

### SUPABASE SCHEMA

```sql
-- Users (handled by Supabase Auth)

-- Interviews
create table interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  name text not null,
  mode text default 'conversational',
  status text default 'in_progress', -- in_progress | completed
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Answers
create table answers (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid references interviews,
  question_number int not null,
  category text not null,
  question text not null,
  answer text not null,
  claude_response text,
  response_type text, -- NEXT_QUESTION | FOLLOW_UP
  created_at timestamp default now()
);

-- Generated Profiles
create table profiles (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid references interviews,
  user_id uuid references auth.users,
  name text not null,
  content text not null, -- full markdown
  created_at timestamp default now()
);
```

---

### WHAT TO BUILD FIRST (MVP PRIORITY ORDER)

1. Interview screen with Claude API integration (core loop)
2. Progress tracking sidebar
3. Profile generation + download
4. Auth + Supabase save/resume
5. Landing page
6. Dashboard

---

### APP NAME & BRANDING

- **App name**: VoiceDNA
- **Tagline**: "Teach AI to think like you."
- **Mode**: Light mode default. Dark mode is a user toggle in Settings.
- **Color palette**: Warm off-white paper (`#F7F6F2`) background, blue (`#1D4ED8`) accent, white surfaces. No dark backgrounds, no gradients, no purple.
- **Logo concept**: Wordmark — "Voice" in `DM Sans` regular + "DNA" in `DM Sans` 500 with `--vd-accent` color. Optional: a minimal waveform glyph of 5–7 vertical bars at varying heights.
- **Full design system**: See `voicedna-DESIGN.md` — that file is the top priority for all visual decisions.

---

### OUT OF SCOPE (V1)

- Team/shared profiles
- Voice recording (just text input for now)
- AI-to-AI comparison
- Public profile sharing

---

*Build this clean, fast, and focused. The interview experience is the product.*
