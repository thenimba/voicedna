import type { Category } from "@/lib/questions";

interface Props {
  category: Category;
  questionNumber: number;
  totalQuestions: number;
  isFollowUp: boolean;
}

export const InterviewTopBar = ({ category, questionNumber, totalQuestions, isFollowUp }: Props) => {
  const progress = Math.min((questionNumber / totalQuestions) * 100, 100);

  return (
    <div>
      <div className="flex items-center gap-4 px-6 lg:px-8 h-[42px] border-b border-vd-border bg-vd-surface">
        {/* Category badge */}
        <span
          className={`font-mono-label text-[10px] px-2 py-0.5 rounded-sm ${
            isFollowUp
              ? "bg-vd-amber-bg text-vd-amber"
              : "bg-vd-accent-bg text-vd-accent-text"
          }`}
        >
          {category.name}
        </span>

        {isFollowUp && (
          <span className="font-mono-label text-[10px] text-vd-amber">
            Follow-up
          </span>
        )}

        <div className="flex-1" />

        <span className="font-mono-data text-[11px] text-vd-t3">
          Section Progress: {questionNumber}/{totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-vd-border">
        <div
          className="h-full bg-vd-accent transition-[width] duration-[400ms] ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
