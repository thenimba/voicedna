import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Settings, Filter } from "lucide-react";
import type { InterviewMode } from "@/lib/interview-store";
import { CATEGORIES, INITIAL_QUESTIONS } from "@/lib/questions";
import { PageFrame } from "@/components/layout/PageFrame";
import { useT } from "@/lib/i18n";

const Onboarding = () => {
  const navigate = useNavigate();
  const { t, tQuestion } = useT();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<InterviewMode>("quick-profile");
  const [starting, setStarting] = useState(false);

  const STAGE_LABELS = [
    t("onb.stage.identity"),
    t("onb.stage.method"),
    t("onb.stage.briefing"),
  ];

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
      title: t("onb.mode.deep.title"),
      time: t("onb.mode.deep.time"),
      type: t("onb.mode.deep.type"),
      desc: t("onb.mode.deep.desc"),
      recommended: true,
    },
    {
      id: "quick-profile",
      icon: <Zap className="w-5 h-5 text-vd-accent" />,
      title: t("onb.mode.quick.title"),
      time: t("onb.mode.quick.time"),
      type: t("onb.mode.quick.type"),
      desc: t("onb.mode.quick.desc"),
    },
    {
      id: "specialized",
      icon: <Filter className="w-5 h-5 text-vd-t3" />,
      title: t("onb.mode.spec.title"),
      time: t("onb.mode.spec.time"),
      type: t("onb.mode.spec.type"),
      desc: t("onb.mode.spec.desc"),
    },
  ];

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
      currentQuestion:
        tQuestion(CATEGORIES[0].id, 0) ||
        INITIAL_QUESTIONS[CATEGORIES[0].id][0],
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
      protocolTag={`VoiceDNA / ${t("onb.stage.step")} 0${step + 1}`}
      refLabel={`${t("onb.stage.ref")} ${step + 1} / 03 · ${STAGE_LABELS[step].toUpperCase()}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
        <aside className="lg:col-span-3 bg-vd-cream p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-vd-border">
          <p className="font-mono-label text-[10px] tracking-[0.2em] text-vd-t3 mb-8">
            {t("onb.stages")}
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
                      {t("onb.stage.step")} 0{i + 1}
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
              {t("onb.advice")}
            </p>
          </div>
        </aside>

        <section className="lg:col-span-9 p-8 md:p-14 lg:p-20 flex flex-col justify-center">
          {step === 0 && (
            <div className="max-w-xl animate-fade-in">
              <span className="font-mono-label text-[11px] tracking-[0.18em] text-vd-accent-text block mb-6">
                {t("onb.step1.eyebrow")}
              </span>
              <h1 className="font-serif-question text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.15] text-vd-t1 mb-6">
                {t("onb.step1.title.line")}
                <br />
                <span className="italic">{t("onb.step1.title.italic")}</span>
              </h1>
              <p className="text-[14px] text-vd-t2 leading-relaxed mb-10 max-w-md">
                {t("onb.step1.help")}
              </p>

              <label className="block">
                <span className="font-mono-label text-[10px] text-vd-t3 block mb-2">
                  {t("onb.step1.label")}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("onb.step1.placeholder")}
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
                  {t("onb.continue")}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </button>
                <span className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3">
                  {t("onb.enterHint")}
                </span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in">
              <span className="font-mono-label text-[11px] tracking-[0.18em] text-vd-accent-text block mb-6">
                {t("onb.step2.eyebrow")}
              </span>
              <h1 className="font-serif-question text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.15] text-vd-t1 mb-6">
                {t("onb.step2.title.line")} <span className="italic">{t("onb.step2.title.italic")}</span>
              </h1>
              <p className="text-[14px] text-vd-t2 leading-relaxed mb-10 max-w-lg">
                {t("onb.step2.help")}
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
                          0{i + 1} / {t("onb.mode.option")}
                        </span>
                        {m.recommended && (
                          <span className="font-mono-label text-[9px] border border-vd-border text-vd-t3 px-1.5 py-0.5">
                            {t("onb.mode.recommended")}
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
                            {t("onb.mode.selected")}
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-vd-t3 flex items-center gap-1">
                            {t("onb.mode.select")} <ArrowRight className="w-3 h-3 rtl:rotate-180" />
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
                  {t("onb.continueBrief")}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </button>
                <button
                  onClick={() => setStep(0)}
                  className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3 hover:text-vd-t2 transition-colors"
                >
                  {t("onb.back")}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-xl animate-fade-in">
              <span className="font-mono-label text-[11px] tracking-[0.18em] text-vd-accent-text block mb-6">
                {t("onb.step3.eyebrow")}
              </span>
              <h1 className="font-serif-question text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.15] text-vd-t1 mb-8">
                {t("onb.step3.title.line")} <span className="italic">{t("onb.step3.title.italic")}</span>
              </h1>

              <ol className="space-y-5 text-[14px] text-vd-t2 leading-relaxed mb-10">
                <li className="flex gap-4">
                  <span className="font-mono-label text-[10px] text-vd-t3 mt-1 shrink-0">01</span>
                  <p>
                    {t("onb.step3.li1.a")}{" "}
                    <span className="text-vd-t1 font-medium">{t("onb.step3.li1.b")}</span>{" "}
                    {t("onb.step3.li1.c")}
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono-label text-[10px] text-vd-t3 mt-1 shrink-0">02</span>
                  <p>
                    {t("onb.step3.li2.a")}{" "}
                    <span className="text-vd-t1 font-medium">{t("onb.step3.li2.b")}</span>{" "}
                    {t("onb.step3.li2.c")}
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono-label text-[10px] text-vd-t3 mt-1 shrink-0">03</span>
                  <p className="text-vd-t1 font-medium">{t("onb.step3.li3")}</p>
                </li>
              </ol>

              <div className="border-t border-vd-border pt-4 mb-10">
                <p className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3">
                  {t("onb.step3.saved")}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={handleStart}
                  className="group inline-flex items-center gap-3 bg-vd-accent text-primary-foreground px-7 py-3.5 text-[13px] font-medium hover:bg-vd-accent-text active:translate-y-px transition-all"
                >
                  {t("onb.begin")}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3 hover:text-vd-t2 transition-colors"
                >
                  {t("onb.back")}
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
