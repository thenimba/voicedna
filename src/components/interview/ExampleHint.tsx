import { useT } from "@/lib/i18n";
import { useExample } from "@/lib/use-example";

interface Props {
  question: string;
  categoryId: string;
  questionIndex: number;
}

export const ExampleHint = ({ question, categoryId, questionIndex }: Props) => {
  const { t, lang } = useT();
  const { visible, example, loading, error, show, hide } = useExample({
    question,
    categoryId,
    questionIndex,
    lang,
  });

  return (
    <div className="mt-3 max-w-2xl">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={visible ? hide : show}
          disabled={loading}
          className="font-mono-label text-[10px] tracking-[0.18em] text-vd-t3 hover:text-vd-accent transition-colors disabled:opacity-60"
        >
          {loading
            ? t("iv.example.loading")
            : visible && example
              ? t("iv.example.hide")
              : t("iv.example.show")}
        </button>
        {error && (
          <span className="font-mono-label text-[10px] tracking-[0.14em] text-vd-amber">
            {error}
          </span>
        )}
      </div>

      {visible && example && (
        <div className="mt-2 animate-fade-in border-l border-vd-border rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-4 pl-4 py-2 bg-vd-cream/40">
          <p className="font-mono-label text-[9px] tracking-[0.18em] text-vd-t3 mb-1.5">
            {t("iv.example.label")}
          </p>
          <p className="text-[13.5px] leading-[1.65] text-vd-t2 italic">
            {example}
          </p>
        </div>
      )}
    </div>
  );
};
