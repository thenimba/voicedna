import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, string>();

export interface UseExampleArgs {
  question: string;
  categoryId: string;
  questionIndex: number;
  lang: "en" | "he";
}

export function useExample({
  question,
  categoryId,
  questionIndex,
  lang,
}: UseExampleArgs) {
  const key = `${categoryId}:${questionIndex}:${lang}`;
  const [visible, setVisible] = useState(false);
  const [example, setExample] = useState<string | null>(cache.get(key) ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset when question/lang changes
  useEffect(() => {
    setVisible(false);
    setError(null);
    setExample(cache.get(key) ?? null);
  }, [key]);

  const show = useCallback(async () => {
    setError(null);
    setVisible(true);
    const cached = cache.get(key);
    if (cached) {
      setExample(cached);
      return;
    }
    setLoading(true);
    try {
      const { data, error: invokeErr } = await supabase.functions.invoke(
        "generate-example",
        { body: { question, category: categoryId, lang } },
      );
      if (invokeErr) throw invokeErr;
      const text = (data as { example?: string; error?: string })?.example;
      if (!text) {
        throw new Error(
          (data as { error?: string })?.error ?? "No example returned",
        );
      }
      cache.set(key, text);
      setExample(text);
    } catch (e) {
      console.warn("[example] failed", e);
      setError(e instanceof Error ? e.message : "Could not load example");
    } finally {
      setLoading(false);
    }
  }, [key, question, categoryId, lang]);

  const hide = useCallback(() => setVisible(false), []);

  return { visible, example, loading, error, show, hide };
}
