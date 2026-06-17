import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Download, RotateCw, Lock, Mail, Sparkles, Loader2 } from "lucide-react";
import { getInitialState, resetInterview } from "@/lib/interview-store";
import { Waveform } from "@/components/interview/Waveform";
import { PageFrame } from "@/components/layout/PageFrame";
import { isAnonymous, getProfile, type Profile } from "@/lib/auth";
import { deleteSession } from "@/lib/interview-sync";
import { useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Completion = () => {
  const navigate = useNavigate();
  const { t, tCategory } = useT();
  const state = getInitialState();
  const [anon, setAnon] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState<string | null>(null);

  useEffect(() => {
    isAnonymous().then(setAnon);
    getProfile().then(setProfile);
  }, []);

  const handleDownload = () => {
    let md = `# VOICE PROFILE: ${state.userName}\n\n`;
    md += `## Core Identity\n\nGenerated from a ${state.qaPairs.length}-question VoiceDNA interview.\n\n---\n\n`;

    const categories = [...new Set(state.qaPairs.map((qa) => qa.category))];
    categories.forEach((cat) => {
      md += `## ${tCategory(cat)}\n\n`;
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

  const downloadMarkdown = (md: string, suffix = "") => {
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.userName || "voicedna"}${suffix}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAnalyze = async () => {
    if (analyzing) return;
    if (analyzed) {
      downloadMarkdown(analyzed, "-voice-profile");
      return;
    }
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-voice-profile", {
        body: { userName: state.userName, qaPairs: state.qaPairs },
      });
      if (error) throw error;
      const md = (data as { markdown?: string })?.markdown;
      if (!md) throw new Error("Empty response");
      setAnalyzed(md);
      downloadMarkdown(md, "-voice-profile");
    } catch (e) {
      console.error("[analyze]", e);
      toast({ title: t("comp.analyze.error"), variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleNewSession = async () => {
    await deleteSession();
    resetInterview();
    navigate("/");
  };

  const profileSize = new Blob([JSON.stringify(state.qaPairs)]).size;
  const tokenEstimate = Math.round(profileSize / 2.5);
  const sessionId = profile?.session_code ?? "VD-LOCAL";

  return (
    <PageFrame
      protocolTag={t("comp.protocol")}
      refLabel={`${t("comp.ref")} · ${sessionId}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
        <section className="lg:col-span-7 p-8 md:p-14 lg:p-20 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-vd-border">
          <span className="font-mono-label text-[11px] tracking-[0.18em] text-vd-accent-text block mb-6">
            {t("comp.eyebrow")}
          </span>

          <h1 className="font-serif-question text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-vd-t1 mb-6">
            {t("comp.title.your")}{" "}
            <span className="italic">{t("comp.title.italic")}</span>
            <br />
            {t("comp.title.tail")}
          </h1>

          <p className="text-[16px] text-vd-t2 leading-relaxed max-w-md mb-10">
            {state.userName ? `${state.userName}, ` : ""}
            {t("comp.body")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <button
              onClick={handleDownload}
              className="group inline-flex items-center gap-3 bg-vd-accent text-primary-foreground px-7 py-3.5 text-[13px] font-medium hover:bg-vd-accent-text active:translate-y-px transition-all"
            >
              {t("comp.download")}
              <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>
            <button
              onClick={handleNewSession}
              className="inline-flex items-center gap-2 px-4 py-2 text-[12px] text-vd-t2 hover:text-vd-t1 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              {t("comp.newSession")}
            </button>
          </div>

          {anon ? (
            <Link
              to="/auth?claim=1"
              className="mt-10 block border border-vd-amber-border bg-vd-amber-bg p-5 hover:bg-vd-amber-bg/70 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <Lock className="w-4 h-4 text-vd-amber mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-mono-label text-[10px] tracking-[0.16em] text-vd-amber mb-1">
                    {t("comp.claim.label")}
                  </p>
                  <p className="font-serif-question text-[16px] text-vd-t1 leading-snug mb-1">
                    {t("comp.claim.title")}
                  </p>
                  <p className="text-[12px] text-vd-t2">
                    {t("comp.claim.body")}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-vd-amber mt-1 shrink-0 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
              </div>
            </Link>
          ) : profile && profile.is_claimed ? (
            <div className="mt-10 border border-vd-green bg-vd-green-bg p-4 flex items-center gap-3">
              <Mail className="w-4 h-4 text-vd-green shrink-0" />
              <p className="font-mono-label text-[10px] tracking-[0.16em] text-vd-green">
                {t("comp.claimed")}
              </p>
            </div>
          ) : null}

          <div className="mt-12 pt-6 border-t border-vd-border">
            <p className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3 mb-3">
              {t("comp.howto")}
            </p>
            <pre
              className="font-mono-data text-[12px] text-vd-t2 bg-vd-cream border border-vd-border p-4 whitespace-pre-wrap leading-relaxed"
              dir="ltr"
            >
              {`> Read ${state.userName || "[your-name]"}.md first.\n> Then [your task].`}
            </pre>
          </div>
        </section>

        <aside className="lg:col-span-5 bg-vd-cream p-8 md:p-12 flex flex-col justify-between gap-10">
          <div className="space-y-10">
            <p className="font-mono-label text-[10px] tracking-[0.2em] text-vd-t3">
              {t("comp.specs")}
            </p>

            <Waveform
              barCount={36}
              maxHeight={56}
              className="opacity-90 justify-start"
            />

            <dl className="space-y-5">
              <div className="flex items-baseline justify-between border-b border-vd-border-strong/40 pb-3">
                <dt className="font-mono-label text-[10px] text-vd-t3">
                  {t("comp.size")}
                </dt>
                <dd className="font-serif-question text-[20px] text-vd-t1">
                  {(profileSize / 1024).toFixed(1)}{" "}
                  <span className="text-[12px] font-sans text-vd-t3">KB</span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-vd-border-strong/40 pb-3">
                <dt className="font-mono-label text-[10px] text-vd-t3">
                  {t("comp.answered")}
                </dt>
                <dd className="font-serif-question text-[20px] text-vd-t1">
                  {state.qaPairs.length}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-vd-border-strong/40 pb-3">
                <dt className="font-mono-label text-[10px] text-vd-t3">
                  {t("comp.tokens")}
                </dt>
                <dd className="font-serif-question text-[20px] text-vd-t1">
                  {tokenEstimate.toLocaleString()}
                </dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="font-mono-label text-[10px] text-vd-t3">
                  {t("comp.refinement")}
                </dt>
                <dd className="font-mono-label text-[11px] text-vd-accent-text">
                  {t("comp.expert")}
                </dd>
              </div>
            </dl>
          </div>

          <figure className="pt-6 border-t border-vd-border-strong/60">
            <blockquote className="font-serif-question italic text-[14px] leading-relaxed text-vd-t2">
              {t("comp.colophon")}
            </blockquote>
            <figcaption className="font-mono-label text-[9px] text-vd-t3 mt-3 tracking-[0.16em]">
              {t("comp.colophon.cap")}
            </figcaption>
          </figure>
        </aside>
      </div>
    </PageFrame>
  );
};

export default Completion;
