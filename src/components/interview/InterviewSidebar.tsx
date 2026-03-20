import type { Category } from "@/lib/questions";

interface Props {
  categories: Category[];
  currentCategoryIndex: number;
  categoryProgress: { completed: number; total: number }[];
}

export const InterviewSidebar = ({ categories, currentCategoryIndex, categoryProgress }: Props) => {
  return (
    <aside className="hidden lg:flex flex-col w-[196px] bg-vd-surface border-r border-vd-border shrink-0">
      {/* Logo */}
      <div className="px-5 py-5">
        <div className="flex items-baseline gap-0">
          <span className="text-base font-sans italic text-vd-t1">VoiceDNA</span>
        </div>
        <p className="font-mono-label text-[9px] text-vd-t3 mt-0.5">
          The Interview Room
        </p>
      </div>

      {/* Categories */}
      <nav className="flex-1 py-4 space-y-0.5">
        {categories.map((cat, i) => {
          const progress = categoryProgress[i];
          const isDone = progress.completed >= progress.total;
          const isActive = i === currentCategoryIndex;
          const isUpcoming = i > currentCategoryIndex;

          return (
            <div
              key={cat.id}
              className={`flex items-center gap-3 px-5 py-2 text-[13px] ${
                isActive
                  ? "bg-vd-accent-bg text-vd-accent-text font-medium"
                  : isDone
                  ? "opacity-55 text-vd-t2"
                  : "opacity-45 text-vd-t2"
              }`}
            >
              {/* Status dot */}
              <span className="flex items-center justify-center w-[15px] h-[15px] shrink-0">
                {isDone ? (
                  <span className="w-[15px] h-[15px] rounded-full bg-vd-green-bg flex items-center justify-center">
                    <span className="text-vd-green text-[9px]">✓</span>
                  </span>
                ) : isActive ? (
                  <span className="w-[15px] h-[15px] rounded-full bg-vd-accent flex items-center justify-center">
                    <span className="text-primary-foreground text-[8px]">→</span>
                  </span>
                ) : (
                  <span className="w-[15px] h-[15px] rounded-full border border-vd-border" />
                )}
              </span>
              <span>{cat.name}</span>
              {isActive && (
                <span className="ml-auto text-vd-accent text-[10px]">›</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* New Session button */}
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 bg-vd-accent text-primary-foreground rounded-md px-4 py-2.5 text-[12px] font-medium hover:opacity-90 active:scale-[0.97] transition-all">
          + New Session
        </button>
      </div>
    </aside>
  );
};
