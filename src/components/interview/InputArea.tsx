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
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className="border-t border-vd-border bg-vd-surface px-6 lg:px-16 py-4 space-y-3">
      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-transparent text-[13px] text-vd-t1 placeholder:text-vd-t3 resize-y min-h-[64px] focus:outline-none leading-relaxed"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {autoSaved && (
            <span className="font-mono-data text-[10px] text-vd-green flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-vd-green" />
              auto-saved
            </span>
          )}
          <span className="font-mono-data text-[10px] text-vd-t3">
            {wordCount} words
          </span>
        </div>

        <div className="flex items-center gap-3">
          {!isFollowUp && (
            <button
              onClick={onSkip}
              className="text-[12px] text-vd-t3 hover:text-vd-t2 transition-colors"
            >
              Skip question →|
            </button>
          )}
          <button
            onClick={onSubmit}
            disabled={!answer.trim()}
            className={`inline-flex items-center gap-2 text-primary-foreground rounded-md px-5 py-2 text-[12px] font-medium disabled:opacity-40 hover:opacity-90 active:scale-[0.97] transition-all ${
              isFollowUp ? "bg-vd-amber-btn" : "bg-vd-accent"
            }`}
          >
            {isFollowUp ? "Continue" : "Submit Answer"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="text-right">
        <span className="font-mono-data text-[9px] text-vd-t3">
          Press ⌘ + Enter to submit
        </span>
      </div>
    </div>
  );
};
