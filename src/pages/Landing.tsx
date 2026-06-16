import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageFrame } from "@/components/layout/PageFrame";

const STEPS = [
  { n: "01", label: "100 questions", active: false },
  { n: "02", label: "Your .md file", active: true },
  { n: "03", label: "AI becomes you", active: false },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <PageFrame
      protocolTag="VoiceDNA / Protocol 02"
      roomTag="The Interview Room"
      refLabel="REF · VD_LANDING_001"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
        {/* Left: editorial column (7) */}
        <section className="lg:col-span-7 p-8 md:p-14 lg:p-20 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-vd-border">
          <span className="font-mono-label text-[11px] tracking-[0.18em] text-vd-accent-text block mb-6">
            Voice Profile Generator
          </span>

          <h1 className="font-serif-question text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] text-vd-t1 mb-8 tracking-tight">
            Teach AI to
            <br />
            <span className="italic">think like you.</span>
          </h1>

          <p className="text-[17px] md:text-[19px] text-vd-t2 leading-relaxed max-w-md mb-12">
            Answer 100 questions. Download your voice. Upload it to any AI —
            forever.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <button
              onClick={() => navigate("/onboarding")}
              className="group inline-flex items-center gap-3 bg-vd-accent text-primary-foreground px-7 py-3.5 text-[13px] font-medium transition-all duration-200 hover:bg-vd-accent-text active:translate-y-px"
            >
              <span>Start Your Interview</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="flex items-center gap-3">
              <span className="w-6 h-px bg-vd-border-strong" />
              <span className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3">
                Est. 60–90 min
              </span>
            </div>
          </div>
        </section>

        {/* Right: cream marginalia rail (5) */}
        <aside className="lg:col-span-5 bg-vd-cream p-8 md:p-12 flex flex-col justify-between gap-10">
          <div className="space-y-10">
            <p className="font-mono-label text-[10px] tracking-[0.2em] text-vd-t3">
              _Process
            </p>

            {STEPS.map((s) => (
              <div key={s.n} className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="font-mono-label text-[10px] text-vd-t3">
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
              "Your voice is the only thing that belongs only to you."
            </blockquote>
            <figcaption className="font-mono-label text-[9px] text-vd-t3 mt-3 tracking-[0.16em]">
              — INTERVIEW ROOM, EPIGRAPH
            </figcaption>
          </figure>
        </aside>
      </div>
    </PageFrame>
  );
};

export default Landing;
