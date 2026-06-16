import { useT } from "@/lib/i18n";

export const LangToggle = () => {
  const { lang, setLang, t } = useT();
  return (
    <div
      className="inline-flex items-center border border-vd-border"
      title={t("lang.toggle.title")}
      dir="ltr"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`font-mono-label text-[10px] tracking-[0.16em] px-2 py-1 transition-colors ${
          lang === "en"
            ? "bg-vd-t1 text-vd-paper"
            : "text-vd-t3 hover:text-vd-t1"
        }`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <span className="w-px h-3 bg-vd-border" />
      <button
        type="button"
        onClick={() => setLang("he")}
        className={`font-mono-label text-[10px] tracking-[0.16em] px-2 py-1 transition-colors ${
          lang === "he"
            ? "bg-vd-t1 text-vd-paper"
            : "text-vd-t3 hover:text-vd-t1"
        }`}
        aria-pressed={lang === "he"}
      >
        עב
      </button>
    </div>
  );
};
