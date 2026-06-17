## Plan

### 1. Enable Google Sign-In (Lovable Cloud managed)

- Turn on the Google provider via `supabase--configure_social_auth` with `providers: ["google"]` (keep email enabled — both methods are already used in `Auth.tsx`).
- Code already supports it: `src/lib/auth.ts → signInWithGoogle()` uses `lovable.auth.signInWithOAuth("google", …)`, and the Auth page exposes a "Continue with Google" button. No UI changes needed.
- Verify end-to-end: trigger sign-in from `/auth`, confirm `onAuthStateChange` redirects via `afterAuth()`, and that an anonymous session is upgraded cleanly (the existing `pullSession()` call will pull any synced interview state).

### 2. Migrate anonymous user `1b328154-…-1d96a1b145a4` → `nimrodbh@gmail.com`

The owner of that email must first sign in once (Google or email) so an `auth.users` row exists. Then run a one-shot data migration that re-points the orphan rows to the admin's real user id and removes the now-empty anonymous identity.

Steps (executed as a single migration after confirming the admin's user id):

1. Look up admin id: `SELECT id FROM auth.users WHERE email = 'nimrodbh@gmail.com'` → call it `:admin_id`.
2. Re-assign data:
   - `UPDATE public.interview_sessions SET user_id = :admin_id WHERE user_id = '1b328154-af6f-4972-8108-1d96a1b145a4'`
   - For `profiles` (PK = user id) merge by copying any non-null fields from the anonymous profile into the admin's profile (preserve admin's `session_code`), then `DELETE` the anonymous profile row.
3. Remove the orphan auth identity: `DELETE FROM auth.users WHERE id = '1b328154-af6f-4972-8108-1d96a1b145a4'` (cascades clean up any leftovers).

If `nimrodbh@gmail.com` has **not** signed in yet, I'll pause after step 1 and ask them to sign in once before running the merge — otherwise there is no target id to attach the data to.

### Technical notes

- `signInAnonymously` stays enabled (core to the app, documented in security memory).
- No schema changes; migration is data-only but uses the migration tool because it touches `auth.users`.
- No client code changes required for either item.

### Question before I execute

Has `nimrodbh@gmail.com` already signed into the app at least once? If not, they need to sign in (any method) so I have a target user id to merge the anonymous session into.
