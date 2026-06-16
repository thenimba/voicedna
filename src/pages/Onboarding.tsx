import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Settings, Filter } from "lucide-react";
import type { InterviewMode } from "@/lib/interview-store";
import { CATEGORIES, INITIAL_QUESTIONS } from "@/lib/questions";
import { PageFrame } from "@/components/layout/PageFrame";

const modes: {
  id: InterviewMode;
  icon: React.ReactNode;
  title: string;
  time: string;
  type: string;
  desc: string;
  recommended?: boolean;
}[] = [
  {
    id: "deep-dive",
    icon: <Settings className="w-5 h-5 text-vd-accent" />,
    title: "The Deep Dive",
    time: "60–90 min",
    type: "Full Spectrum",
    desc: "An exhaustive architectural audit of your beliefs, mechanisms, and subconscious patterns. The foundation for a perfect clone.",
    recommended: true,
  },
  {
    id: "quick-profile",
    icon: <Zap className="w-5 h-5 text-vd-accent" />,
    title: "The Quick Profile",
    time: "20–30 min",
    type: "Core Attributes",
    desc: "Captures the immediate rhythm and tone of your writing. Ideal for those who need to get started quickly with high accuracy.",
  },
  {
    id: "specialized",
    icon: <Filter className="w-5 h-5 text-vd-t3" />,
    title: "The Specialized Audit",
    time: "15 min",
    type: "Mechanics Only",
    desc: "Focuses strictly on the structural mechanics of your syntax and vocabulary. No psychological profiling, pure technical mimicry.",
  },
];

const STAGE_LABELS = ["Identity", "Method", "Briefing"];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<InterviewMode>("quick-profile");

  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    if (starting) return;
    setStarting(true);
    const state = {
      userName: name,
      mode,
      currentCategoryIndex: 0,
      currentQuestionInCategory: 0,
      totalQuestionsAnswered: 0,
      qaPairs: [] as any[],
      currentQuestion: INITIAL_QUESTIONS[CATEGORIES[0].id][0],
      isFollowUp: false,
      followUpCount: 0,
      status: "in_progress" as const,
    };
    localStorage.setItem("voicedna-interview", JSON.stringify(state));
    try {
      const { ensureAnonymousUser, updateDisplayName } = await import("@/lib/auth");
      const { pushNow } = await import("@/lib/interview-sync");
      await ensureAnonymousUser();
      await updateDisplayName(name);
      await pushNow(state as any);
    } catch (e) {
      console.warn("[onboarding] cloud bootstrap failed (continuing offline)", e);
    }
    navigate("/interview");
  };

  return (
    <PageFrame
      protocolTag={`VoiceDNA / Stage 0${step + 1}`}
      roomTag="The Interview Room"
      refLabel={`STAGE ${step + 1} / 03 · ${STAGE_LABELS[step].toUpperCase()}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
        {/* Left rail: stages */}
        <aside className="lg:col-span-3 bg-vd-cream p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-vd-border">
          <p className="font-mono-label text-[10px] tracking-[0.2em] text-vd-t3 mb-8">
            _Stages
          </p>

          <ol className="space-y-7">
            {STAGE_LABELS.map((label, i) => {
              const isActive = i === step;
              const isDone = i < step;
              return (
                <li key={label} className="flex items-start gap-4">
                  <div
                    className={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium ${
                      isActive
                        ? "bg-vd-accent text-primary-foreground"
                        : isDone
                        ? "bg-vd-green-bg text-vd-green"
                        : "border border-vd-border-strong text-vd-t3"
                    }`}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="font-mono-label text-[9px] text-vd-t3">
                      STEP 0{i + 1}
                    </p>
                    <p
                      className={`font-serif-question text-[16px] leading-tight ${
                        isActive ? "text-vd-t1" : "text-vd-t2"
                      }`}
                    >
                      {label}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="hidden lg:block mt-12 pt-6 border-t border-vd-border-strong/60">
            <p className="font-serif-question italic text-[13px] leading-relaxed text-vd-t2">
              "Be specific. The interviewer pushes back on vague answers."
            </p>
          </div>
        </aside>

        {/* Right: stage body */}
        <section className="lg:col-span-9 p-8 md:p-14 lg:p-20 flex flex-col justify-center">
          {/* Step 1: Name */}
          {step === 0 && (
            <div className="max-w-xl animate-fade-in">
              <span className="font-mono-label text-[11px] tracking-[0.18em] text-vd-accent-text block mb-6">
                Identity · Step 01
              </span>
              <h1 className="font-serif-question text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.15] text-vd-t1 mb-6">
                Before we begin,
                <br />
                <span className="italic">what should we call you?</span>
              </h1>
              <p className="text-[14px] text-vd-t2 leading-relaxed mb-10 max-w-md">
                This name will be used in your final voice profile document.
              </p>

              <label className="block">
                <span className="font-mono-label text-[10px] text-vd-t3 block mb-2">
                  Your name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Adam Smith"
                  className="w-full max-w-md px-4 py-3 bg-vd-surface border border-vd-border text-[15px] text-vd-t1 placeholder:text-vd-t3 focus:outline-none focus:border-vd-accent transition-colors"
                  autoFocus
                />
              </label>

              <div className="mt-10 flex items-center gap-6">
                <button
                  onClick={() => name.trim() && setStep(1)}
                  disabled={!name.trim()}
                  className="group inline-flex items-center gap-3 bg-vd-accent text-primary-foreground px-6 py-3 text-[12px] font-medium disabled:opacity-40 hover:bg-vd-accent-text active:translate-y-px transition-all"
                >
                  Continue
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <span className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3">
                  Enter ↵
                </span>
              </div>
            </div>
          )}

          {/* Step 2: Mode selection */}
          {step === 1 && (
            <div className="animate-fade-in">
              <span className="font-mono-label text-[11px] tracking-[0.18em] text-vd-accent-text block mb-6">
                Method · Step 02
              </span>
              <h1 className="font-serif-question text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.15] text-vd-t1 mb-6">
                Choose your <span className="italic">interview style.</span>
              </h1>
              <p className="text-[14px] text-vd-t2 leading-relaxed mb-10 max-w-lg">
                To capture the true essence of your voice, we need to determine
                the depth of our exploration. Select the method that fits your
                current availability.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {modes.map((m, i) => {
                  const selected = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`relative text-left p-5 border transition-colors duration-150 ${
                        selected
                          ? "border-vd-accent bg-vd-accent-bg"
                          : "border-vd-border bg-vd-surface hover:border-vd-border-strong"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono-label text-[9px] text-vd-t3">
                          0{i + 1} / OPTION
                        </span>
                        {m.recommended && (
                          <span className="font-mono-label text-[9px] border border-vd-border text-vd-t3 px-1.5 py-0.5">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="mb-3">{m.icon}</div>
                      <h3 className="font-serif-question text-[18px] text-vd-t1 mb-1">
                        {m.title}
                      </h3>
                      <p className="font-mono-label text-[10px] text-vd-accent-text mb-3">
                        {m.time} · {m.type}
                      </p>
                      <p className="text-[12px] text-vd-t2 leading-relaxed">
                        {m.desc}
                      </p>
                      <div className="mt-4 pt-3 border-t border-vd-border/70">
                        {selected ? (
                          <span className="text-[11px] font-medium text-vd-accent-text">
                            Selected ✓
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-vd-t3 flex items-center gap-1">
                            Select <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={() => setStep(2)}
                  className="group inline-flex items-center gap-3 bg-vd-accent text-primary-foreground px-6 py-3 text-[12px] font-medium hover:bg-vd-accent-text active:translate-y-px transition-all"
                >
                  Continue to Briefing
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => setStep(0)}
                  className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3 hover:text-vd-t2 transition-colors"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Explainer */}
          {step === 2 && (
            <div className="max-w-xl animate-fade-in">
              <span className="font-mono-label text-[11px] tracking-[0.18em] text-vd-accent-text block mb-6">
                Briefing · Step 03
              </span>
              <h1 className="font-serif-question text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.15] text-vd-t1 mb-8">
                How this <span className="italic">works.</span>
              </h1>

              <ol className="space-y-5 text-[14px] text-vd-t2 leading-relaxed mb-10">
                <li className="flex gap-4">
                  <span className="font-mono-label text-[10px] text-vd-t3 mt-1 shrink-0">
                    01
                  </span>
                  <p>
                    The AI interviewer will ask you{" "}
                    <span className="text-vd-t1 font-medium">100 questions</span>{" "}
                    across 7 categories about your voice, beliefs, and style.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono-label text-[10px] text-vd-t3 mt-1 shrink-0">
                    02
                  </span>
                  <p>
                    It will push back on vague answers — max{" "}
                    <span className="text-vd-t1 font-medium">2 follow-ups</span>{" "}
                    per question, then move on.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono-label text-[10px] text-vd-t3 mt-1 shrink-0">
                    03
                  </span>
                  <p className="text-vd-t1 font-medium">
                    Be honest. Be specific. The more precise you are, the better
                    your voice profile will be.
                  </p>
                </li>
              </ol>

              <div className="border-t border-vd-border pt-4 mb-10">
                <p className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3">
                  Auto-saved · Close and resume any time.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={handleStart}
                  className="group inline-flex items-center gap-3 bg-vd-accent text-primary-foreground px-7 py-3.5 text-[13px] font-medium hover:bg-vd-accent-text active:translate-y-px transition-all"
                >
                  Begin Interview
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3 hover:text-vd-t2 transition-colors"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </PageFrame>
  );
};

export default Onboarding;
