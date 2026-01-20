import { createHighlighter, type Highlighter } from "shiki";
import {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/constants/languages";
import zennTheme from "@/themes/zenn.json";
import type { ThemeRegistration } from "shiki";
import { createDiffTransformer } from "@/transformers/diffTransformer";

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    const langs = [
      ...new Set(
        SUPPORTED_LANGUAGES.map((l) => (l.id === "diff" ? "typescript" : l.id))
      ),
    ];

    highlighterPromise = createHighlighter({
      themes: [zennTheme as ThemeRegistration],
      langs,
    });
  }
  return highlighterPromise;
}

export async function highlightWithShiki(
  lang: SupportedLanguage,
  code: string
): Promise<string> {
  const highlighter = await getHighlighter();

  return highlighter.codeToHtml(code, {
    lang: lang === "diff" ? "typescript" : lang,
    theme: "zenn",
    transformers: lang === "diff" ? [createDiffTransformer()] : [],
  });
}
