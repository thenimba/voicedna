import { useNavigate } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { getInitialState, resetInterview } from "@/lib/interview-store";
import { Waveform } from "@/components/interview/Waveform";

const Completion = () => {
  const navigate = useNavigate();
  const state = getInitialState();

  const handleDownload = () => {
    // Generate a basic markdown profile from answers
    let md = `# VOICE PROFILE: ${state.userName}\n\n`;
    md += `## Core Identity\n\nGenerated from a ${state.qaPairs.length}-question VoiceDNA interview.\n\n---\n\n`;

    const categories = [...new Set(state.qaPairs.map((qa) => qa.category))];
    categories.forEach((cat) => {
      md += `## ${cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}\n\n`;
      const catQAs = state.qaPairs.filter((qa) => qa.category === cat);
      catQAs.forEach((qa) => {
        md += `### Q: ${qa.question}\n${qa.answer}\n\n`;
      });
      md += "---\n\n";
    });

    md += `## HOW TO USE THIS FILE\n\nStart every AI session with: "Read ${state.userName}.md first. Then [your task]."\nUpdate this file every 3-4 months as your voice evolves.\nThis file works with Claude, ChatGPT, Gemini, Grok, and any other AI.\n`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.userName || "voicedna"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewSession = () => {
    resetInterview();
    navigate("/");
  };

  const profileSize = new Blob([JSON.stringify(state.qaPairs)]).size;
  const tokenEstimate = Math.round(profileSize / 2.5);

  return (
    <div className="min-h-screen bg-vd-paper flex flex-col items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        <p className="font-mono-label text-[11px] text-vd-accent-text tracking-widest">
          Analysis Complete
        </p>

        <h1 className="font-serif-question text-[clamp(1.5rem,4vw,2rem)] leading-[1.2] text-vd-t1">
          Your <span className="italic">VoiceDNA</span> is complete.
        </h1>

        <Waveform barCount={20} maxHeight={40} className="mx-auto" />

        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-3 bg-vd-accent text-primary-foreground rounded-md px-8 py-4 text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-all w-full max-w-xs mx-auto justify-center"
        >
          Download .md Profile
          <Download className="w-4 h-4" />
        </button>

        <p className="text-[13px] text-vd-t2 leading-relaxed">
          You can now upload this file to any AI to preserve your unique writing style.
        </p>

        {/* Stats */}
        <div className="border-t border-vd-border pt-6 mt-8">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="font-mono-label text-[9px] text-vd-t3">Profile Size</p>
              <p className="font-mono-data text-sm text-vd-t1 mt-1">
                {(profileSize / 1024).toFixed(1)} KB
              </p>
            </div>
            <div>
              <p className="font-mono-label text-[9px] text-vd-t3">Tokens Captured</p>
              <p className="font-mono-data text-sm text-vd-t1 mt-1">
                {tokenEstimate.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="font-mono-label text-[9px] text-vd-t3">Refinement Level</p>
              <p className="font-mono-data text-sm text-vd-t1 mt-1 font-medium">
                Expert
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleNewSession}
          className="text-[12px] text-vd-t3 hover:text-vd-t2 transition-colors mt-4"
        >
          + New Session
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center">
        <p className="font-mono-data text-[10px] text-vd-t3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-vd-t3" />
          VoiceDNA Internal Archive — Session ID: VD-{Math.random().toString(36).slice(2, 6).toUpperCase()}
        </p>
      </footer>
    </div>
  );
};

export default Completion;
