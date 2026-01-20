import type { SupportedLanguage } from "@/constants/languages";
import fs from "node:fs/promises";
import path from "node:path";

const sampleCodePaths: Record<SupportedLanguage, string> = {
  javascript: "javascript.js",
  typescript: "typescript.ts",
  python: "python.py",
  rust: "rust.rs",
  go: "go.go",
  java: "java.java",
  c: "c.c",
  cpp: "cpp.cpp",
  csharp: "csharp.cs",
  ruby: "ruby.rb",
  php: "php.php",
  swift: "swift.swift",
  kotlin: "kotlin.kt",
  html: "html.html",
  css: "css.css",
  json: "json.json",
  yaml: "yaml.yaml",
  markdown: "markdown.md",
  sql: "sql.sql",
  bash: "bash.sh",
  diff: "diff-typescript.ts",
};

export async function loadSampleCode(lang: SupportedLanguage): Promise<string> {
  const filename = sampleCodePaths[lang];
  const filePath = path.join(process.cwd(), "src/sampleCodes", filename);
  return fs.readFile(filePath, "utf-8");
}
