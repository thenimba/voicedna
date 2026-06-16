# DESIGN.md — VoiceDNA (Light Mode)
> Agent-friendly design system document · Stitch DESIGN.md format
> Use this file to generate, iterate, or extend any VoiceDNA screen

---

## Overview

VoiceDNA is a guided AI interview tool that helps people build a portable voice profile (a `.md` file) they can upload to any AI. The design concept is called **"The Interview Room"** — serious, focused, warm. Not a chatbot. Not a form. An interview.

The interface should feel like sitting in a quiet, well-lit room across from a sharp journalist. Purposeful. Unhurried. The kind of place where you give honest answers.

**Design references**: Linear (precision), Notion (clarity), The Atlantic (editorial authority)
**Mode**: Light mode default. Dark mode is a user toggle — not the primary experience.
**Tone**: Professional without being corporate. Focused without being cold.

---

## Color Tokens

### Core Palette

| Token | Value | Usage |
|---|---|---|
| `--vd-paper` | `#F7F6F2` | Page background — warm off-white, like quality paper |
| `--vd-surface` | `#FFFFFF` | Cards, sidebar, input areas |
| `--vd-border` | `#E3E1D9` | Default borders — warm, not neutral gray |
| `--vd-border-strong` | `#C8C5BD` | Emphasized borders, textarea focus |
| `--vd-cream` | `#F5F3EE` | Interviewer question bubble background |
| `--vd-cream-border` | `#DDD9CE` | Interviewer bubble border tint |

### Text

| Token | Value | Usage |
|---|---|---|
| `--vd-t1` | `#18181B` | Primary text — near-black with warmth |
| `--vd-t2` | `#52525B` | Secondary text — user answers, descriptions |
| `--vd-t3` | `#A1A1AA` | Tertiary — metadata, labels, hints |

### Accent (Blue — trust, focus)

| Token | Value | Usage |
|---|---|---|
| `--vd-accent` | `#1D4ED8` | Primary CTA, active states, progress fill, question border |
| `--vd-accent-bg` | `#EFF6FF` | Active category highlight, selected mode card tint |
| `--vd-accent-text` | `#1E40AF` | Text on accent-bg surfaces |

### Semantic States

| Token | Value | State |
|---|---|---|
| `--vd-amber` | `#92400E` | Pushback / follow-up text |
| `--vd-amber-bg` | `#FFFBEB` | Pushback bubble background |
| `--vd-amber-border` | `#FDE68A` | Pushback bubble accent line |
| `--vd-amber-btn` | `#B45309` | Submit button during pushback state |
| `--vd-green` | `#059669` | Auto-saved indicator, completed category |
| `--vd-green-bg` | `#ECFDF5` | Completed category dot background |

### Design rationale
Warm tones throughout — `#F7F6F2` paper background instead of pure white — reduce eye strain during the 60–90 minute interview session. The amber pushback state visually signals a gear-shift without being alarming. Blue is reserved exclusively for questions and progress, so users develop an automatic association: blue = Claude asking, amber = Claude pushing back.

---

## Typography

### Font Pairing — The Core Design Decision

The most distinctive choice in VoiceDNA's visual language: **serif for questions, sans-serif for everything else**.

| Role | Font | Fallback | Size | Weight |
|---|---|---|---|---|
| Interviewer questions | `Lora` | `Georgia, 'Times New Roman', serif` | 16–18px | 400 |
| UI / answers / body | `DM Sans` | `system-ui, sans-serif` | 12–14px | 400/500 |
| Category labels / counters | `JetBrains Mono` | `'Courier New', monospace` | 10–12px | 400 |
| Completion headline | `Lora` | `Georgia, serif` | 24–28px | 400 |

**Why serif for questions?**
Claude's questions should feel weighty — worth answering carefully. Rendering them in a serif font creates an unconscious signal: this is not a chatbot response. It's a considered question from an authoritative interviewer. The editorial quality of serif type slows the reader down just enough to engage seriously.

### Type Scale

| Name | Size | Line-height | Usage |
|---|---|---|---|
| Display | 26–28px | 1.3 | Completion headline |
| Question | 16–18px | 1.6 | Interviewer question text |
| Body | 13–14px | 1.6 | User answers, descriptions, UI text |
| Label | 11–12px | 1.4 | Category names, metadata |
| Micro | 10–11px | 1.3 | Counters, auto-save, mono tags |

### Text rendering rules
- Question text is always `font-style: normal` — never italic (italics suggest uncertainty)
- Category labels use `letter-spacing: 0.06em; text-transform: uppercase` — small-caps feel, mono font
- User answer text uses `--vd-t2` (not full black) — softer than the interviewer voice
- The "auto-saved" indicator uses mono font — data, not conversation

---

## Layout & Spacing

### Interview Screen Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Sidebar: 196px] │ [Main content area: flex-grow]           │
│                  │ ┌───────────────────────────────────────┐│
│  VoiceDNA logo   │ │ Top bar: badge + Q counter            ││
│  ──────────────  │ │ 2px progress line                     ││
│  ✓ Beliefs       │ ├───────────────────────────────────────┤│
│  → Writing Mech. │ │ Conversation area (scrollable)        ││
│  ○ Aesthetic     │ │   Previous Q dimmed (0.55 opacity)    ││
│  ○ Voice         │ │   ──────────────────────────────────  ││
│  ○ Structure     │ │   Current question (serif, full)      ││
│  ○ Hard Nos      │ │   Answer textarea OR user bubble      ││
│  ○ Red Flags     │ ├───────────────────────────────────────┤│
│                  │ │ Input area (sticky bottom)            ││
│                  │ │   [auto-saved] [Skip] [Submit →]      ││
└─────────────────────────────────────────────────────────────┘
```

### Sidebar
- Width: `196px` — narrow enough to not compete with the main content
- Background: `--vd-surface` (white) — lighter than the paper background
- Category item height: `~32px` with `7px 18px` padding
- Active category: `--vd-accent-bg` background fill, no border — keep it subtle
- Category icons: `15×15px` circles — checkmark (done), arrow (active), empty (upcoming)
- No section headers — the category names are self-describing

### Top Bar
- Height: `~42px`
- Contains: category badge (left), Q counter (right, mono font)
- Progress bar: `2px` height, sits directly below the bar — not inside it

### Conversation Area
- Padding: `22px` on all sides
- Gap between elements: `14px`
- Previous question: `opacity: 0.55` — visible for context, not competing
- Divider between previous and current: `0.5px` warm border line

### Input Area (sticky bottom)
- Height: `~80px` — compact, not dominant
- Background: `--vd-surface` with top border
- Textarea: `64px` minimum height, resizable upward
- Controls row: saved indicator left / skip + submit right

### Spacing Scale
| Name | Value | Usage |
|---|---|---|
| xs | 4px | Internal icon padding |
| sm | 8px | Gap between inline elements |
| md | 12–14px | Component internal padding |
| lg | 18–22px | Section padding |
| xl | 28–36px | Screen-level vertical breathing room |

---

## Components

### Question Bubble (Interviewer)
```
background: --vd-cream
border-left: 2px solid --vd-accent
border-radius: 0 8px 8px 0   (flat on the left — leans against the wall)
padding: 14px 16px
```
The left-flat border-radius is intentional — the question "leans against" the left edge, like a thought that comes from outside the conversation.

### Pushback Bubble (Follow-up state)
```
background: --vd-amber-bg
border-left: 2px solid #F59E0B
border-radius: 0 8px 8px 0
font: 13px, --vd-t2 → override to --vd-amber
```
Submit button changes from accent-blue to `--vd-amber-btn` during pushback — the UI signals "you're being challenged, this is a different kind of response expected."

### User Answer Bubble (past answers)
```
background: --vd-surface
border: 0.5px solid --vd-border
border-radius: 8px
margin-left: 20px   (indented — subordinate to the question)
font-size: 13px, --vd-t2
```

### Category Item (Sidebar)
Three states:
- **Done**: `opacity: 0.55`, green checkmark dot
- **Active**: `--vd-accent-bg` fill, accent-colored text, arrow dot
- **Upcoming**: `opacity: 0.45`, empty circle dot

No animation on state transitions — the progress feels earned, not animated.

### Progress Bar
```
height: 2px
background: --vd-border (track)
fill: --vd-accent (progress)
transition: width 0.4s ease
```
A 2px bar fills slowly. Never show a percentage number — make the user feel forward motion, not count it.

### Auto-save Indicator
```
font: 10px JetBrains Mono, letter-spacing: 0.04em
color: --vd-green
content: "● auto-saved"
```
The green dot + mono type makes it feel like a system status — not marketing.

### Mode Selection Cards (Onboarding)
```
default: surface bg, 0.5px border
selected: 2px solid --vd-accent, --vd-accent-bg fill
radio pip: 14px circle, fills solid accent when selected
```

### Primary Button
```
background: --vd-accent
color: white
border-radius: 6px
padding: 7px 18px
font: 12px/500
```
No rounded pill buttons — `6px` radius is sharp and professional.

### Completion Waveform
A set of 20 static vertical bars with varying heights (8–40px) representing the DNA of the voice — not a loading indicator, not a data visualization. A visual metaphor. Bars use `--vd-accent` at varying opacities (0.4–1.0), weighted by bar height.

---

## Screen States

### 1. Standard Question
- Question bubble: blue accent border
- Submit button: `--vd-accent` blue
- Badge: blue on `--vd-accent-bg`

### 2. Pushback / Follow-up
- Pushback bubble: amber accent border
- Submit button: `--vd-amber-btn` warm brown
- Badge: amber on `--vd-amber-bg`
- The visual shift tells the user: "different mode, different energy required"

### 3. Completion
- No sidebar, no progress bar
- Full-screen centered layout
- Waveform visual replaces the conversation flow
- File download area is the only CTA — no distractions

---

## Motion & Interaction

### Principles
- **Functional motion only** — no decorative animations
- **Never animate progress numbers** — progress should feel earned, not celebrated
- **One transition per interaction** — don't stack effects

### Specific transitions
| Element | Transition | Duration |
|---|---|---|
| New question appears | `opacity 0 → 1` | `200ms ease` |
| Progress bar fill | `width` | `400ms ease` |
| Mode card selection | `border-color` | `150ms` |
| Category state change | none — instant | — |
| Pushback state shift | `background` on bubble | `200ms` |

### What NOT to animate
- Category completion — keep it instant (progress feels deserved, not handed out)
- Question counter — no number rolling
- Auto-save indicator — appears and disappears without transition

---

## Responsive Behavior

### Desktop (≥1024px)
Full sidebar + main layout as designed.

### Tablet (768–1023px)
- Sidebar collapses to `60px` — shows only category icons (dots/checkmarks)
- Hover on sidebar icon reveals a tooltip with category name

### Mobile (< 768px)
- Sidebar hidden — replaced by a horizontal progress strip at top (7 dots, colored by state)
- Question text reduces to `15px`
- Input area becomes full-width, sticky bottom
- Onboarding mode cards stack vertically

---

## Component Hierarchy Summary

```
App
├── Sidebar
│   ├── Logo wordmark
│   └── Category list (7 items × 3 states)
└── Main
    ├── Top bar (badge + Q counter)
    ├── Progress bar (2px)
    ├── Conversation area (scrollable)
    │   ├── Previous Q&A (dimmed)
    │   ├── Divider
    │   ├── Current question bubble
    │   └── Answer textarea OR user answer bubble
    └── Input area (sticky)
        └── Controls row (save indicator + skip + submit)
```

---

## Design System Constraints for AI Generation

When generating new screens or variations of VoiceDNA using this DESIGN.md:

**Always:**
- Use Georgia/Lora serif for all question text — this is the single most important brand differentiator
- Use `--vd-paper` (`#F7F6F2`) as the page background — never pure white
- Keep the border-left treatment on all question/pushback bubbles — flat left, rounded right
- Show the Q counter in monospace — it's data, not marketing copy
- Indent user answer bubbles (`margin-left: 20px`) relative to interviewer bubbles

**Never:**
- Use dark backgrounds on any primary surface in light mode
- Use purple or gradient accents — the brand is blue-only
- Add cheering or positive feedback UI (no stars, no "Great job!", no confetti)
- Round the category sidebar items fully — they are rectangular rows, not pills
- Show the progress percentage as a number — only as a fill bar

**Pushback state rules:**
- ONLY change the accent color (blue → amber) when a pushback is active
- Revert ALL accent colors to blue immediately when a new standard question loads
- The submit button color MUST match the current bubble accent color

---

*File generated from VoiceDNA design concept · March 2026*
*Format: Stitch DESIGN.md (agent-friendly design system)*
