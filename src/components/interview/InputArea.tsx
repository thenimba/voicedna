import { ArrowRight } from "lucide-react";

interface Props {
  answer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  isFollowUp: boolean;
  autoSaved: boolean;
  wordCount: number;
  placeholder: string;
}

export const InputArea = ({
  answer,
  onAnswerChange,
  onSubmit,
  onSkip,
  isFollowUp,
  autoSaved,
  wordCount,
  placeholder,
}: Props) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onSubmit();
  };

  return (
    <div className="border-t border-vd-border bg-vd-surface px-6 lg:px-12 py-5">
      <div className="border border-vd-border focus-within:border-vd-accent transition-colors bg-vd-paper/40">
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <span className="font-mono-label text-[9px] tracking-[0.18em] text-vd-t3">
            COMPOSE
          </span>
          <span className="font-mono-data text-[10px] text-vd-t3">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
        </div>
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-transparent px-4 pb-4 text-[14px] text-vd-t1 placeholder:text-vd-t3 resize-y min-h-[72px] focus:outline-none leading-relaxed"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {autoSaved ? (
            <span className="font-mono-label text-[10px] tracking-[0.14em] text-vd-green flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-vd-green" />
              Auto-saved
            </span>
          ) : (
            <span className="font-mono-label text-[10px] tracking-[0.14em] text-vd-t3">
              Press ⌘ + Enter to submit
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {!isFollowUp && (
            <button
              onClick={onSkip}
              className="font-mono-label text-[10px] tracking-[0.14em] text-vd-t3 hover:text-vd-t2 transition-colors"
            >
              Skip →
            </button>
          )}
          <button
            onClick={onSubmit}
            disabled={!answer.trim()}
            className={`group inline-flex items-center gap-2.5 text-primary-foreground px-5 py-2.5 text-[12px] font-medium disabled:opacity-40 active:translate-y-px transition-all ${
              isFollowUp
                ? "bg-vd-amber-btn hover:opacity-90"
                : "bg-vd-accent hover:bg-vd-accent-text"
            }`}
          >
            {isFollowUp ? "Continue" : "Submit Answer"}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
