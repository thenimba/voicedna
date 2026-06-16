import { useNavigate } from "react-router-dom";
import { ArrowRight, Download, RotateCw } from "lucide-react";
import { getInitialState, resetInterview } from "@/lib/interview-store";
import { Waveform } from "@/components/interview/Waveform";
import { PageFrame } from "@/components/layout/PageFrame";

const Completion = () => {
  const navigate = useNavigate();
  const state = getInitialState();

  const handleDownload = () => {
    let md = `# VOICE PROFILE: ${state.userName}\n\n`;
    md += `## Core Identity\n\nGenerated from a ${state.qaPairs.length}-question VoiceDNA interview.\n\n---\n\n`;

    const categories = [...new Set(state.qaPairs.map((qa) => qa.category))];
    categories.forEach((cat) => {
      md += `## ${cat
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())}\n\n`;
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
  const sessionId = `VD-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  return (
    <PageFrame
      protocolTag="VoiceDNA / Issue Pressed"
      roomTag="The Interview Room"
      refLabel={`SESSION · ${sessionId}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
        {/* Left: artifact column */}
        <section className="lg:col-span-7 p-8 md:p-14 lg:p-20 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-vd-border">
          <span className="font-mono-label text-[11px] tracking-[0.18em] text-vd-accent-text block mb-6">
            Analysis Complete
          </span>

          <h1 className="font-serif-question text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-vd-t1 mb-6">
            Your <span className="italic">VoiceDNA</span>
            <br />
            is on the press.
          </h1>

          <p className="text-[16px] text-vd-t2 leading-relaxed max-w-md mb-10">
            {state.userName ? `${state.userName}, ` : ""}your voice has been
            captured as a portable markdown file. Upload it to any AI to
            preserve your style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <button
              onClick={handleDownload}
              className="group inline-flex items-center gap-3 bg-vd-accent text-primary-foreground px-7 py-3.5 text-[13px] font-medium hover:bg-vd-accent-text active:translate-y-px transition-all"
            >
              Download .md Profile
              <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>
            <button
              onClick={handleNewSession}
              className="inline-flex items-center gap-2 px-4 py-2 text-[12px] text-vd-t2 hover:text-vd-t1 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Start new session
            </button>
          </div>

          <div className="mt-12 pt-6 border-t border-vd-border">
            <p className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3 mb-3">
              How to use this file
            </p>
            <pre className="font-mono-data text-[12px] text-vd-t2 bg-vd-cream border border-vd-border p-4 whitespace-pre-wrap leading-relaxed">
              {`> Read ${state.userName || "[your-name]"}.md first.\n> Then [your task].`}
            </pre>
          </div>
        </section>

        {/* Right: cream stats rail */}
        <aside className="lg:col-span-5 bg-vd-cream p-8 md:p-12 flex flex-col justify-between gap-10">
          <div className="space-y-10">
            <p className="font-mono-label text-[10px] tracking-[0.2em] text-vd-t3">
              _Issue Specs
            </p>

            <Waveform
              barCount={36}
              maxHeight={56}
              className="opacity-90 justify-start"
            />

            <dl className="space-y-5">
              <div className="flex items-baseline justify-between border-b border-vd-border-strong/40 pb-3">
                <dt className="font-mono-label text-[10px] text-vd-t3">
                  Profile Size
                </dt>
                <dd className="font-serif-question text-[20px] text-vd-t1">
                  {(profileSize / 1024).toFixed(1)}{" "}
                  <span className="text-[12px] font-sans text-vd-t3">KB</span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-vd-border-strong/40 pb-3">
                <dt className="font-mono-label text-[10px] text-vd-t3">
                  Questions Answered
                </dt>
                <dd className="font-serif-question text-[20px] text-vd-t1">
                  {state.qaPairs.length}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-vd-border-strong/40 pb-3">
                <dt className="font-mono-label text-[10px] text-vd-t3">
                  Tokens Captured
                </dt>
                <dd className="font-serif-question text-[20px] text-vd-t1">
                  {tokenEstimate.toLocaleString()}
                </dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="font-mono-label text-[10px] text-vd-t3">
                  Refinement
                </dt>
                <dd className="font-mono-label text-[11px] text-vd-accent-text">
                  Expert
                </dd>
              </div>
            </dl>
          </div>

          <figure className="pt-6 border-t border-vd-border-strong/60">
            <blockquote className="font-serif-question italic text-[14px] leading-relaxed text-vd-t2">
              "Update this file every 3–4 months as your voice evolves."
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

export default Completion;
