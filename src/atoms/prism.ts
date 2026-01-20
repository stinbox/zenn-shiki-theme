import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import Prism from "prismjs";
import type { SupportedLanguage } from "../constants/languages";
import { sampleCodeAtomFamily } from "./sampleCode";

// 必要な言語を静的インポート（依存関係順）
import "prismjs/components/prism-markup-templating"; // PHPの依存
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-php";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";

// Prism言語IDマッピング
const prismLanguageMap: Record<SupportedLanguage, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  rust: "rust",
  go: "go",
  java: "java",
  c: "c",
  cpp: "cpp",
  csharp: "csharp",
  ruby: "ruby",
  php: "php",
  swift: "swift",
  kotlin: "kotlin",
  html: "markup",
  css: "css",
  json: "json",
  yaml: "yaml",
  markdown: "markdown",
  sql: "sql",
  bash: "bash",
  diff: "typescript", // diff は typescript としてハイライト（diff transformerなし）
};

// ハイライト済みHTML atomFamily
export const prismHighlightedCodeAtomFamily = atomFamily(
  (lang: SupportedLanguage) =>
    atom(async (get) => {
      const code = await get(sampleCodeAtomFamily(lang));
      const prismLang = prismLanguageMap[lang];
      const grammar = Prism.languages[prismLang];

      if (!grammar) {
        return escapeHtml(code);
      }

      return Prism.highlight(code, grammar, prismLang);
    })
);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
