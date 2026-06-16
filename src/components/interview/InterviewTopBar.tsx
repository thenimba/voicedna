import type { Category } from "@/lib/questions";
import { SyncIndicator } from "./SyncIndicator";
import { useT } from "@/lib/i18n";

interface Props {
  category: Category;
  questionNumber: number;
  totalQuestions: number;
  isFollowUp: boolean;
}

export const InterviewTopBar = ({
  category,
  questionNumber,
  totalQuestions,
  isFollowUp,
}: Props) => {
  const { t, tCategory } = useT();
  const progress = Math.min((questionNumber / totalQuestions) * 100, 100);

  return (
    <div className="border-b border-vd-border bg-vd-surface">
      <div className="flex items-center gap-4 px-6 lg:px-12 h-[48px]">
        <span className="font-mono-label text-[10px] tracking-[0.16em] text-vd-t3" dir="ltr">
          Q.{String(questionNumber).padStart(3, "0")}
        </span>
        <span className="w-px h-3 bg-vd-border-strong" />
        <span
          className={`font-mono-label text-[10px] tracking-[0.16em] px-2 py-0.5 ${
            isFollowUp
              ? "bg-vd-amber-bg text-vd-amber border border-vd-amber-border"
              : "bg-vd-accent-bg text-vd-accent-text"
          }`}
        >
          {tCategory(category.id)}
        </span>
        {isFollowUp && (
          <span className="font-mono-label text-[10px] tracking-[0.16em] text-vd-amber animate-fade-in">
            {t("iv.followup")}
          </span>
        )}

        <div className="flex-1" />

        <SyncIndicator />
        <span className="w-px h-3 bg-vd-border-strong" />
        <span className="font-mono-data text-[11px] text-vd-t3" dir="ltr">
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      <div className="h-[2px] bg-vd-border">
        <div
          className={`h-full transition-[width] duration-[400ms] ease-out ${
            isFollowUp ? "bg-vd-amber-btn" : "bg-vd-accent"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
