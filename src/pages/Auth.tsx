import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageFrame } from "@/components/layout/PageFrame";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  claimWithEmail,
  isAnonymous,
} from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { pullSession } from "@/lib/interview-sync";
import { saveState } from "@/lib/interview-store";
import { toast } from "sonner";

const AuthPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "signup" ? "signup" : "signin";
  const claim = params.get("claim") === "1";

  const [mode, setMode] = useState<"signin" | "signup">(
    claim ? "signup" : initialMode,
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  useEffect(() => {
    isAnonymous().then(setAnonymous);
  }, []);

  const afterAuth = async () => {
    const remote = await pullSession();
    if (remote) saveState(remote.state);
    const redirect = params.get("redirect");
    navigate(redirect || (remote ? "/interview" : "/"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setBusy(true);
    try {
      if (claim && anonymous) {
        await claimWithEmail(email.trim(), password);
        toast.success("Session saved to your email");
      } else if (mode === "signup") {
        await signUpWithEmail(email.trim(), password);
        toast.success("Account created — you're signed in");
      } else {
        await signInWithEmail(email.trim(), password);
        toast.success("Welcome back");
      }
      await afterAuth();
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const result = await signInWithGoogle();
      if ((result as any)?.error) {
        toast.error((result as any).error.message ?? "Google sign-in failed");
        return;
      }
      if ((result as any)?.redirected) return;
      await afterAuth();
    } catch (err: any) {
      toast.error(err?.message ?? "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  // Listen for OAuth redirect completion
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session && !busy) {
        afterAuth();
      }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = claim
    ? "Save your session"
    : mode === "signup"
    ? "Create account"
    : "Sign in";

  return (
    <PageFrame
      protocolTag="VoiceDNA / Auth"
      roomTag="The Interview Room"
      refLabel="REF · VD_AUTH"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
        <section className="lg:col-span-7 p-8 md:p-14 lg:p-20 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-vd-border">
          <span className="font-mono-label text-[11px] tracking-[0.18em] text-vd-accent-text block mb-6">
            {claim ? "Claim · Lock to email" : mode === "signup" ? "Register" : "Returning"}
          </span>

          <h1 className="font-serif-question text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] text-vd-t1 mb-6">
            {claim ? (
              <>
                Pin your voice to <span className="italic">an inbox.</span>
              </>
            ) : mode === "signup" ? (
              <>
                Start a <span className="italic">new file.</span>
              </>
            ) : (
              <>
                Pick up where <span className="italic">you left off.</span>
              </>
            )}
          </h1>

          <p className="text-[15px] text-vd-t2 leading-relaxed max-w-md mb-10">
            {claim
              ? "Right now your interview is anonymous on this device. Add an email and password and it'll restore from any browser."
              : mode === "signup"
              ? "Email and password, or one click with Google. Your interview saves to the cloud as you answer."
              : "Sign in to restore your interview on this device."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
            <label className="block">
              <span className="font-mono-label text-[10px] text-vd-t3 block mb-2">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full px-4 py-3 bg-vd-surface border border-vd-border text-[15px] text-vd-t1 placeholder:text-vd-t3 focus:outline-none focus:border-vd-accent transition-colors"
              />
            </label>
            <label className="block">
              <span className="font-mono-label text-[10px] text-vd-t3 block mb-2">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-3 bg-vd-surface border border-vd-border text-[15px] text-vd-t1 placeholder:text-vd-t3 focus:outline-none focus:border-vd-accent transition-colors"
              />
            </label>

            <div className="flex items-center gap-6 pt-2">
              <button
                type="submit"
                disabled={busy}
                className="group inline-flex items-center gap-3 bg-vd-accent text-primary-foreground px-6 py-3 text-[12px] font-medium disabled:opacity-40 hover:bg-vd-accent-text active:translate-y-px transition-all"
              >
                {title}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              {!claim && (
                <button
                  type="button"
                  onClick={() =>
                    setMode(mode === "signup" ? "signin" : "signup")
                  }
                  className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3 hover:text-vd-t2 transition-colors"
                >
                  {mode === "signup" ? "Have an account? Sign in" : "New here? Sign up"}
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-vd-border max-w-md">
            <button
              onClick={handleGoogle}
              disabled={busy}
              className="w-full px-5 py-3 border border-vd-border-strong bg-vd-surface text-[13px] text-vd-t1 hover:bg-vd-cream transition-colors disabled:opacity-40"
            >
              Continue with Google
            </button>
            <p className="font-mono-label text-[10px] tracking-[0.14em] text-vd-t3 mt-4">
              <Link to="/" className="hover:text-vd-t1">← Back to entrance</Link>
            </p>
          </div>
        </section>

        <aside className="lg:col-span-5 bg-vd-cream p-8 md:p-12 flex flex-col justify-between gap-10">
          <div className="space-y-8">
            <p className="font-mono-label text-[10px] tracking-[0.2em] text-vd-t3">
              _Why this matters
            </p>
            <ol className="space-y-6 text-[13px] text-vd-t2 leading-relaxed">
              <li className="flex gap-4">
                <span className="font-mono-label text-[10px] text-vd-t3 mt-1 shrink-0">01</span>
                <p>Your answers save to the cloud after every question.</p>
              </li>
              <li className="flex gap-4">
                <span className="font-mono-label text-[10px] text-vd-t3 mt-1 shrink-0">02</span>
                <p>Sign in on any device to resume mid-interview.</p>
              </li>
              <li className="flex gap-4">
                <span className="font-mono-label text-[10px] text-vd-t3 mt-1 shrink-0">03</span>
                <p>Only you can read your file. Backed by row-level security.</p>
              </li>
            </ol>
          </div>
          <figure className="pt-6 border-t border-vd-border-strong/60">
            <blockquote className="font-serif-question italic text-[14px] leading-relaxed text-vd-t2">
              "Don't lose the voice you just spent an hour finding."
            </blockquote>
            <figcaption className="font-mono-label text-[9px] text-vd-t3 mt-3 tracking-[0.16em]">
              — COLOPHON
            </figcaption>
          </figure>
        </aside>
      </div>
    </PageFrame>
  );
};

export default AuthPage;
