# Cloud Backup for Interview Sessions

Persist interview progress to Lovable Cloud so users can resume on any device. Anonymous by default (no friction to start), with an optional "claim with email" step to lock the session to an account.

## How it works for the user

1. **Start an interview** — on first answer we mint an anonymous Supabase auth session for them. A short **session code** (e.g. `VD-7F3K-Q9XM`) appears in the top bar; they can copy it.
2. **Switch device / lose tab** — on Landing, an input lets them paste a session code to restore. Or if they've already claimed with email, they can sign in.
3. **Claim a session** — anytime (and prominently on Completion), a "Save to email" button converts the anonymous user to a permanent account with email + password. Same data, now recoverable by sign-in.
4. **Returning users** — Landing detects existing session and shows "Resume interview (12/45 answered)" instead of pushing them through onboarding again.

## Surfaces touched

- **Landing** — add a small "Have a session code? / Sign in" affordance + auto-resume banner when a local session exists.
- **Onboarding** — on Stage 3 (Briefing complete), create the anonymous auth user and write the initial session row to Cloud.
- **Interview top bar** — show the session code with a copy button; show sync status ("Synced 2s ago" / "Offline — will sync").
- **Interview** — every answer write is mirrored to Cloud (debounced). Draft textarea also persisted.
- **Completion** — prominent "Claim with email" card if still anonymous. After claim, show "Saved to {email}".
- **New `/restore` route** — paste session code → restore state and resume.
- **New `/auth` route** — minimal sign-in / sign-up screen (email + password, plus Google sign-in by default per Cloud guidance).

## Data model (Cloud)

Two tables, both keyed to `auth.users(id)`:

- **`profiles`** — one row per user. Fields: `display_name`, `session_code` (unique, the short shareable code), `is_claimed` (false for anonymous, true after email claim). Auto-created by trigger on signup.
- **`interview_sessions`** — one row per interview. Fields: `user_id` (FK to auth.users), `user_name`, `mode`, `status`, `current_category_index`, `current_question_in_category`, `total_questions_answered`, `current_question`, `is_follow_up`, `follow_up_count`, `qa_pairs` (jsonb array), `draft_answer` (in-progress textarea), `last_synced_at`. RLS: users see only their own rows.

GRANTs on both tables: `authenticated` (full CRUD on own rows via RLS), `service_role` (all).

## Auth configuration

- Enable **anonymous sign-ins** (`external_anonymous_users_enabled: true`) — this is what powers the no-friction start.
- Email/password enabled (default).
- Google sign-in enabled (Cloud default; managed credentials, zero config).
- No auto-confirm email — standard verification flow.
- Claim flow uses `supabase.auth.updateUser({ email, password })` on the existing anonymous user, which preserves `auth.uid()` and therefore all their data.

## Sync strategy

- `interview-store.ts` keeps localStorage as the fast path (offline resilience, instant UI).
- A new `interview-sync.ts` layer mirrors writes to Cloud with a 500ms debounce per answer. Draft textarea syncs at 2s debounce.
- On app load: if authenticated, fetch the Cloud session and merge — Cloud wins on conflict (last-write-wins by `last_synced_at`).
- Sync status surfaces in the top bar marginalia.

## Out of scope

- Real AI follow-ups (still mock).
- Password reset flow (can add later — would need a `/reset-password` page).
- Multiple concurrent interviews per user.
- Real-time collaboration / multi-tab conflict resolution beyond last-write-wins.

## Implementation order

1. Migration: `profiles` + `interview_sessions` tables, RLS, GRANTs, signup trigger that generates a unique `session_code`.
2. Enable anonymous auth + confirm Google provider via `configure_auth` / `configure_social_auth`.
3. `src/lib/auth.ts` — anonymous bootstrap, claim-with-email, sign-in, sign-out, `onAuthStateChange` listener.
4. `src/lib/interview-sync.ts` — debounced push/pull between `interview-store` and Cloud.
5. `/auth` page (email + password + Google) and `/restore` page (session code input).
6. Wire Onboarding → creates anonymous user on completion.
7. Wire Interview → sync answers + draft; show session code & sync pill in top bar.
8. Wire Completion → "Claim with email" card.
9. Wire Landing → resume banner + "Have a session code?" link.
10. QA: fresh start → answer → close tab → reopen on "other device" (incognito) → restore via code → claim with email → sign out → sign in → data intact.
