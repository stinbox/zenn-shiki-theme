import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import { eagerAtom } from "jotai-eager";
import {
  bundledLanguages,
  createHighlighter,
  type Highlighter,
  type LanguageRegistration,
} from "shiki";
import type { SupportedLanguage } from "../constants/languages";
import { sampleCodeAtomFamily } from "./sampleCode";
import { createDiffTransformer } from "../transformers/diffTransformer";
import "../transformers/diffTransformer.css";

// Shikiハイライターインスタンス（シングルトン）
export const shikiHighlighterAtom = atom<Promise<Highlighter>>(async () => {
  const highlighter = await createHighlighter({
    themes: ["nord"],
    langs: [],
  });

  return highlighter;
});

// 言語定義の動的インポートマップ
const shikiLanguageImportMap: Record<
  SupportedLanguage,
  () => ReturnType<(typeof bundledLanguages)[keyof typeof bundledLanguages]>
> = {
  javascript: () => bundledLanguages.javascript(),
  typescript: () => bundledLanguages.typescript(),
  python: () => bundledLanguages.python(),
  rust: () => bundledLanguages.rust(),
  go: () => bundledLanguages.go(),
  java: () => bundledLanguages.java(),
  c: () => bundledLanguages.c(),
  cpp: () => bundledLanguages.cpp(),
  csharp: () => bundledLanguages.csharp(),
  ruby: () => bundledLanguages.ruby(),
  php: () => bundledLanguages.php(),
  swift: () => bundledLanguages.swift(),
  kotlin: () => bundledLanguages.kotlin(),
  html: () => bundledLanguages.html(),
  css: () => bundledLanguages.css(),
  json: () => bundledLanguages.json(),
  yaml: () => bundledLanguages.yaml(),
  markdown: () => bundledLanguages.markdown(),
  sql: () => bundledLanguages.sql(),
  bash: () => bundledLanguages.bash(),
  diff: () => bundledLanguages.typescript(), // diff は typescript でハイライト
};

// 言語定義モジュールを管理するatomFamily
export const shikiLanguageModuleAtomFamily = atomFamily(
  (lang: SupportedLanguage) =>
    atom<Promise<LanguageRegistration[]>>(async () => {
      const langModule = await shikiLanguageImportMap[lang]();
      return langModule.default;
    })
);

// ハイライト済みHTML atomFamily
export const shikiHighlightedCodeAtomFamily = atomFamily(
  (lang: SupportedLanguage) =>
    eagerAtom((get) => {
      const highlighter = get(shikiHighlighterAtom);
      const langModule = get(shikiLanguageModuleAtomFamily(lang));
      const code = get(sampleCodeAtomFamily(lang));

      highlighter.loadLanguageSync(langModule);

      return highlighter.codeToHtml(code, {
        lang: lang === "diff" ? "typescript" : lang,
        theme: "nord",
        transformers: [createDiffTransformer()],
      });
    })
);
