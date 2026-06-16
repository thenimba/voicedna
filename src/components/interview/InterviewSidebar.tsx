import { useNavigate } from "react-router-dom";
import type { Category } from "@/lib/questions";

interface Props {
  categories: Category[];
  currentCategoryIndex: number;
  categoryProgress: { completed: number; total: number }[];
}

export const InterviewSidebar = ({
  categories,
  currentCategoryIndex,
  categoryProgress,
}: Props) => {
  const navigate = useNavigate();
  const totalAnswered = categoryProgress.reduce((s, p) => s + p.completed, 0);
  const totalQuestions = categoryProgress.reduce((s, p) => s + p.total, 0);

  return (
    <aside className="hidden lg:flex flex-col w-[240px] bg-vd-cream border-r border-vd-border shrink-0">
      <div className="px-6 pt-6 pb-4 border-b border-vd-border-strong/50">
        <p className="font-mono-label text-[10px] tracking-[0.2em] text-vd-t3 mb-2">
          _Categories
        </p>
        <p className="font-serif-question text-[14px] text-vd-t2 leading-snug">
          <span className="text-vd-t1 font-medium">{totalAnswered}</span>
          <span className="text-vd-t3"> / {totalQuestions} answered</span>
        </p>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {categories.map((cat, i) => {
          const progress = categoryProgress[i];
          const isDone = progress.completed >= progress.total;
          const isActive = i === currentCategoryIndex;

          return (
            <div
              key={cat.id}
              className={`px-6 py-3 border-l-2 transition-colors ${
                isActive
                  ? "border-l-vd-accent bg-vd-accent-bg"
                  : "border-l-transparent hover:bg-vd-surface/60"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono-label text-[9px] text-vd-t3">
                  0{i + 1}
                </span>
                {isDone ? (
                  <span className="font-mono-label text-[9px] text-vd-green">
                    ✓ DONE
                  </span>
                ) : isActive ? (
                  <span className="font-mono-label text-[9px] text-vd-accent-text">
                    ACTIVE
                  </span>
                ) : (
                  <span className="font-mono-label text-[9px] text-vd-t3">
                    {progress.completed}/{progress.total}
                  </span>
                )}
              </div>
              <p
                className={`font-serif-question text-[15px] leading-tight ${
                  isActive
                    ? "text-vd-t1 font-medium"
                    : isDone
                    ? "text-vd-t2"
                    : "text-vd-t2"
                }`}
              >
                {cat.name}
              </p>
              <div className="mt-2 h-[2px] bg-vd-border-strong/40 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isDone ? "bg-vd-green" : "bg-vd-accent"
                  }`}
                  style={{
                    width: `${
                      progress.total
                        ? (progress.completed / progress.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-vd-border-strong/50">
        <button
          onClick={() => navigate("/")}
          className="w-full text-center font-mono-label text-[10px] tracking-[0.16em] text-vd-t3 hover:text-vd-t2 transition-colors py-2"
        >
          ← Exit Interview
        </button>
      </div>
    </aside>
  );
};
