import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Settings, Filter } from "lucide-react";
import type { InterviewMode } from "@/lib/interview-store";
import { CATEGORIES, INITIAL_QUESTIONS } from "@/lib/questions";

const modes: { id: InterviewMode; icon: React.ReactNode; title: string; time: string; type: string; desc: string; recommended?: boolean }[] = [
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

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<InterviewMode>("quick-profile");

  const handleStart = () => {
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
    navigate("/interview");
  };

  return (
    <div className="min-h-screen bg-vd-paper flex flex-col">
      {/* Top bar */}
      <nav className="flex items-center gap-4 px-8 py-4 border-b border-vd-border">
        <span className="text-base font-sans font-medium text-vd-t1">VoiceDNA</span>
        <span className="text-vd-border">|</span>
        <span className="font-mono-label text-[10px] text-vd-t3">
          Onboarding Stage {step + 1}
        </span>
        <div className="flex-1" />
        <span className="font-mono-data text-[11px] text-vd-t3">
          Section Progress: {step + 1}/3
        </span>
      </nav>

      {/* Progress bar */}
      <div className="h-[2px] bg-vd-border">
        <div
          className="h-full bg-vd-accent transition-[width] duration-400"
          style={{ width: `${((step + 1) / 3) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        {/* Step 1: Name */}
        {step === 0 && (
          <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
            <p className="font-mono-label text-[11px] text-vd-accent-text tracking-widest">
              The Interview Room
            </p>
            <h1 className="font-serif-question text-[26px] leading-[1.3] text-vd-t1">
              Before we begin, what should we call you?
            </h1>
            <p className="text-[13px] text-vd-t2 leading-relaxed">
              This name will be used in your final voice profile document.
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-vd-surface border border-vd-border rounded-md text-sm text-vd-t1 placeholder:text-vd-t3 focus:outline-none focus:border-vd-border-strong transition-colors"
              autoFocus
            />
            <button
              onClick={() => name.trim() && setStep(1)}
              disabled={!name.trim()}
              className="inline-flex items-center gap-2 bg-vd-accent text-primary-foreground rounded-md px-6 py-2.5 text-xs font-medium disabled:opacity-40 hover:opacity-90 active:scale-[0.97] transition-all"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 2: Mode selection */}
        {step === 1 && (
          <div className="max-w-3xl w-full text-center space-y-8 animate-fade-in">
            <p className="font-mono-label text-[11px] text-vd-accent-text tracking-widest">
              The Interview Room
            </p>
            <h1 className="font-serif-question text-[26px] leading-[1.3] text-vd-t1">
              Choose your interview style.
            </h1>
            <p className="text-[13px] text-vd-t2 leading-relaxed max-w-lg mx-auto">
              To capture the true essence of your voice, we need to determine the depth of our exploration. Select the method that best fits your current availability.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-8">
              {modes.map((m) => {
                const selected = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`relative p-5 rounded-lg border-2 transition-colors duration-150 text-left ${
                      selected
                        ? "border-vd-accent bg-vd-accent-bg"
                        : "border-vd-border bg-vd-surface hover:border-vd-border-strong"
                    }`}
                  >
                    {selected && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono-label text-[9px] bg-vd-accent text-primary-foreground px-2 py-0.5 rounded-sm">
                        Current Selection
                      </span>
                    )}
                    {m.recommended && !selected && (
                      <span className="absolute top-4 right-4 font-mono-label text-[9px] border border-vd-border text-vd-t3 px-2 py-0.5 rounded-sm">
                        Recommended
                      </span>
                    )}
                    <div className="mb-4">{m.icon}</div>
                    <h3 className="text-base font-sans font-medium text-vd-t1 mb-1">{m.title}</h3>
                    <p className="font-mono-label text-[10px] text-vd-accent-text mb-3">
                      {m.time} · {m.type}
                    </p>
                    <p className="text-[12px] text-vd-t2 leading-relaxed">{m.desc}</p>
                    <div className="mt-4">
                      {selected ? (
                        <span className="text-[12px] font-medium text-vd-accent-text">Selected Strategy ✓</span>
                      ) : (
                        <span className="text-[12px] font-medium text-vd-accent-text flex items-center gap-1">
                          {m.id === "deep-dive" ? "Begin Analysis" : "Select Mode"} <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 bg-vd-accent text-primary-foreground rounded-md px-6 py-2.5 text-xs font-medium hover:opacity-90 active:scale-[0.97] transition-all"
            >
              Continue to Environment Setup
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 3: Explainer */}
        {step === 2 && (
          <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
            <p className="font-mono-label text-[11px] text-vd-accent-text tracking-widest">
              Protocol Briefing
            </p>
            <h1 className="font-serif-question text-[26px] leading-[1.3] text-vd-t1">
              How this works.
            </h1>
            <div className="text-left space-y-4 text-[13px] text-vd-t2 leading-relaxed bg-vd-surface border border-vd-border rounded-lg p-6">
              <p>
                The AI interviewer will ask you {100} questions across 7 categories about your writing voice, beliefs, and style.
              </p>
              <p>
                It will push back on vague answers — max 2 follow-ups per question before moving on. It may request specific examples when answers are abstract.
              </p>
              <p className="font-medium text-vd-t1">
                Be honest. Be specific. The more precise you are, the better your voice profile will be.
              </p>
              <p className="text-vd-t3 text-[11px] font-mono-data">
                Your progress is auto-saved. You can close and resume at any time.
              </p>
            </div>
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 bg-vd-accent text-primary-foreground rounded-md px-7 py-3 text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-all"
            >
              Begin Interview
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="font-mono-data text-[10px] text-vd-t3 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-vd-green" />
          Secure Interview Protocol Active
        </p>
      </footer>
    </div>
  );
};

export default Onboarding;
