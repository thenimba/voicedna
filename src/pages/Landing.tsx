import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Waveform } from "@/components/interview/Waveform";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-vd-paper flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-baseline gap-0">
          <span className="text-lg font-sans font-normal text-vd-t1">Voice</span>
          <span className="text-lg font-sans font-medium text-vd-accent">DNA</span>
        </div>
        <span className="font-mono-label text-[10px] text-vd-t3">
          The Interview Room
        </span>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
        <div className="max-w-xl text-center space-y-8">
          <p className="font-mono-label text-[11px] text-vd-accent-text tracking-widest">
            Voice Profile Generator
          </p>

          <h1 className="font-serif-question text-[clamp(2rem,5vw,2.75rem)] leading-[1.15] text-vd-t1 text-balance">
            Teach AI to think like you.
          </h1>

          <p className="text-[15px] text-vd-t2 leading-relaxed max-w-md mx-auto">
            Answer 100 questions. Download your voice. Upload it to any AI — forever.
          </p>

          {/* Pyramid visual */}
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="flex items-center gap-3 text-[12px] text-vd-t3 font-mono-data">
              <span className="px-3 py-1.5 border border-vd-border rounded bg-vd-surface">100 questions</span>
              <ArrowRight className="w-3 h-3 text-vd-t3" />
              <span className="px-3 py-1.5 border border-vd-accent/30 rounded bg-vd-accent-bg text-vd-accent-text">Your .md file</span>
              <ArrowRight className="w-3 h-3 text-vd-t3" />
              <span className="px-3 py-1.5 border border-vd-border rounded bg-vd-surface">AI becomes you</span>
            </div>
          </div>

          <Waveform barCount={9} maxHeight={28} className="mx-auto opacity-30" />

          <button
            onClick={() => navigate("/onboarding")}
            className="inline-flex items-center gap-2 bg-vd-accent text-primary-foreground rounded-md px-7 py-3 text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.97] transition-transform"
          >
            Start Your Interview
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="font-mono-data text-[10px] text-vd-t3">
          Secure Interview Protocol Active
        </p>
      </footer>
    </div>
  );
};

export default Landing;
