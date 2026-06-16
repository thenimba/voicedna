import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en } from "./en";
import { he } from "./he";
import type { Dictionary, Lang } from "./types";

const DICTS: Record<Lang, Dictionary> = { en, he };
const STORAGE_KEY = "voicedna.lang";

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tCategory: (id: string) => string;
  tQuestion: (categoryId: string, index: number) => string;
  tFollowUp: (index: number) => string;
};

const I18nContext = createContext<Ctx | null>(null);

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "he" ? "he" : "en";
}

function applyHtml(lang: Lang) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === "he" ? "rtl" : "ltr";
}

function interpolate(s: string, vars?: Record<string, string | number>) {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
  );
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    applyHtml(lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(() => {
    const dict = DICTS[lang];
    const fallback = DICTS.en;
    return {
      lang,
      dir: lang === "he" ? "rtl" : "ltr",
      setLang,
      t: (key, vars) =>
        interpolate(dict.ui[key] ?? fallback.ui[key] ?? key, vars),
      tCategory: (id) =>
        dict.categories[id] ?? fallback.categories[id] ?? id,
      tQuestion: (categoryId, index) => {
        const list = dict.questions[categoryId] ?? fallback.questions[categoryId];
        return list?.[index] ?? fallback.questions[categoryId]?.[index] ?? "";
      },
      tFollowUp: (index) =>
        dict.followUps[index] ?? fallback.followUps[index] ?? "",
    };
  }, [lang, setLang]);

  return createElement(I18nContext.Provider, { value }, children);
}

export function useT(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used within LangProvider");
  return ctx;
}

export function getCurrentLang(): Lang {
  return readInitialLang();
}
