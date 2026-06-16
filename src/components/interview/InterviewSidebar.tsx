import { useNavigate } from "react-router-dom";
import type { Category } from "@/lib/questions";
import { useT } from "@/lib/i18n";

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
  const { t, tCategory } = useT();
  const totalAnswered = categoryProgress.reduce((s, p) => s + p.completed, 0);
  const totalQuestions = categoryProgress.reduce((s, p) => s + p.total, 0);

  return (
    <aside className="hidden lg:flex flex-col w-[240px] bg-vd-cream border-r border-vd-border rtl:border-r-0 rtl:border-l shrink-0">
      <div className="px-6 pt-6 pb-4 border-b border-vd-border-strong/50">
        <p className="font-mono-label text-[10px] tracking-[0.2em] text-vd-t3 mb-2">
          {t("iv.sidebar.categories")}
        </p>
        <p className="font-serif-question text-[14px] text-vd-t2 leading-snug">
          <span className="text-vd-t1 font-medium">{totalAnswered}</span>
          <span className="text-vd-t3"> / {totalQuestions} {t("iv.sidebar.answered")}</span>
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
              className={`px-6 py-3 border-l-2 rtl:border-l-0 rtl:border-r-2 transition-colors ${
                isActive
                  ? "border-l-vd-accent rtl:border-r-vd-accent bg-vd-accent-bg"
                  : "border-l-transparent rtl:border-r-transparent hover:bg-vd-surface/60"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono-label text-[9px] text-vd-t3" dir="ltr">
                  0{i + 1}
                </span>
                {isDone ? (
                  <span className="font-mono-label text-[9px] text-vd-green">
                    {t("iv.sidebar.done")}
                  </span>
                ) : isActive ? (
                  <span className="font-mono-label text-[9px] text-vd-accent-text">
                    {t("iv.sidebar.active")}
                  </span>
                ) : (
                  <span className="font-mono-label text-[9px] text-vd-t3" dir="ltr">
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
                {tCategory(cat.id)}
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
          {t("iv.sidebar.exit")}
        </button>
      </div>
    </aside>
  );
};
