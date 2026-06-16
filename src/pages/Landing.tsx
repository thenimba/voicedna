import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, LogIn } from "lucide-react";
import { PageFrame } from "@/components/layout/PageFrame";
import { getInitialState } from "@/lib/interview-store";
import { pullSession } from "@/lib/interview-sync";
import { useT } from "@/lib/i18n";

const Landing = () => {
  const navigate = useNavigate();
  const { t, dir } = useT();
  const [resume, setResume] = useState<{
    answered: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    const local = getInitialState();
    if (local.status === "in_progress" && local.totalQuestionsAnswered > 0) {
      setResume({
        answered: local.totalQuestionsAnswered,
        name: local.userName || "your interview",
      });
    }
    pullSession().then((r) => {
      if (r && r.state.status === "in_progress" && r.state.totalQuestionsAnswered > 0) {
        setResume((cur) =>
          cur && cur.answered >= r.state.totalQuestionsAnswered
            ? cur
            : {
                answered: r.state.totalQuestionsAnswered,
                name: r.state.userName || "your interview",
              },
        );
      }
    });
  }, []);

  const STEPS = [
    { n: "01", label: t("landing.step.1"), active: false },
    { n: "02", label: t("landing.step.2"), active: true },
    { n: "03", label: t("landing.step.3"), active: false },
  ];

  return (
    <PageFrame refLabel={t("landing.ref")}>
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
        <section className="lg:col-span-7 p-8 md:p-14 lg:p-20 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-vd-border">
          <span className="font-mono-label text-[11px] tracking-[0.18em] text-vd-accent-text block mb-6">
            {t("landing.eyebrow")}
          </span>

          <h1 className="font-serif-question text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] text-vd-t1 mb-8 tracking-tight">
            {t("landing.title.line1")}
            <br />
            <span className="italic">{t("landing.title.italic")}</span>
          </h1>

          <p className="text-[17px] md:text-[19px] text-vd-t2 leading-relaxed max-w-md mb-12">
            {t("landing.subtitle")}
          </p>

          {resume && (
            <div className="mb-6 p-4 border border-vd-accent bg-vd-accent-bg flex items-center justify-between gap-4 max-w-xl">
              <div className="min-w-0">
                <p className="font-mono-label text-[10px] tracking-[0.16em] text-vd-accent-text mb-1">
                  {t("landing.resume.label")}
                </p>
                <p className="text-[13px] text-vd-t1 truncate">
                  {t("landing.resume.body", {
                    answered: resume.answered,
                    name: resume.name,
                  })}
                </p>
              </div>
              <button
                onClick={() => navigate("/interview")}
                className="shrink-0 inline-flex items-center gap-2 bg-vd-accent text-primary-foreground px-4 py-2 text-[12px] font-medium hover:bg-vd-accent-text active:translate-y-px transition-all"
              >
                {t("landing.resume.btn")}
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <button
              onClick={() => navigate("/onboarding")}
              className="group inline-flex items-center gap-3 bg-vd-accent text-primary-foreground px-7 py-3.5 text-[13px] font-medium transition-all duration-200 hover:bg-vd-accent-text active:translate-y-px"
            >
              <span>{resume ? t("landing.cta.fresh") : t("landing.cta.start")}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </button>

            <div className="flex items-center gap-3">
              <span className="w-6 h-px bg-vd-border-strong" />
              <span className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3">
                {t("landing.estimate")}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-vd-border max-w-md">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 font-mono-label text-[10px] tracking-[0.16em] text-vd-t3 hover:text-vd-t1 transition-colors"
            >
              <LogIn className="w-3 h-3" />
              {t("landing.signin")}
            </Link>
          </div>
        </section>

        <aside className="lg:col-span-5 bg-vd-cream p-8 md:p-12 flex flex-col justify-between gap-10">
          <div className="space-y-10">
            <p className="font-mono-label text-[10px] tracking-[0.2em] text-vd-t3">
              {t("landing.process")}
            </p>

            {STEPS.map((s) => (
              <div key={s.n} className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="font-mono-label text-[10px] text-vd-t3" dir="ltr">
                    {s.n}
                  </span>
                  <div className="h-px flex-1 bg-vd-border-strong/60" />
                </div>
                <div
                  className={`border p-4 flex items-center justify-between text-[13px] ${
                    s.active
                      ? "bg-vd-accent-bg border-vd-accent text-vd-accent-text font-medium"
                      : "bg-vd-surface border-vd-border text-vd-t2"
                  }`}
                >
                  <span>{s.label}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      s.active
                        ? "bg-vd-accent"
                        : "border border-vd-border-strong"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <figure className="pt-6 border-t border-vd-border-strong/60">
            <blockquote className="font-serif-question italic text-[15px] leading-relaxed text-vd-t2">
              {t("landing.quote")}
            </blockquote>
            <figcaption className="font-mono-label text-[9px] text-vd-t3 mt-3 tracking-[0.16em]">
              {t("landing.quote.cap")}
            </figcaption>
          </figure>
        </aside>
      </div>
    </PageFrame>
  );
};

export default Landing;
