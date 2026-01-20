import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import type { SupportedLanguage } from "../constants/languages";

const sampleCodeImporters: Record<
  SupportedLanguage,
  () => Promise<{ default: string }>
> = {
  javascript: () => import("../sampleCodes/javascript.js?raw"),
  typescript: () => import("../sampleCodes/typescript.ts?raw"),
  python: () => import("../sampleCodes/python.py?raw"),
  rust: () => import("../sampleCodes/rust.rs?raw"),
  go: () => import("../sampleCodes/go.go?raw"),
  java: () => import("../sampleCodes/java.java?raw"),
  c: () => import("../sampleCodes/c.c?raw"),
  cpp: () => import("../sampleCodes/cpp.cpp?raw"),
  csharp: () => import("../sampleCodes/csharp.cs?raw"),
  ruby: () => import("../sampleCodes/ruby.rb?raw"),
  php: () => import("../sampleCodes/php.php?raw"),
  swift: () => import("../sampleCodes/swift.swift?raw"),
  kotlin: () => import("../sampleCodes/kotlin.kt?raw"),
  html: () => import("../sampleCodes/html.html?raw"),
  css: () => import("../sampleCodes/css.css?raw"),
  json: () => import("../sampleCodes/json.json?raw"),
  yaml: () => import("../sampleCodes/yaml.yaml?raw"),
  markdown: () => import("../sampleCodes/markdown.md?raw"),
  sql: () => import("../sampleCodes/sql.sql?raw"),
  bash: () => import("../sampleCodes/bash.sh?raw"),
  diff: () => import("../sampleCodes/diff-typescript.ts?raw"),
};

export const sampleCodeAtomFamily = atomFamily((lang: SupportedLanguage) =>
  atom(async () => {
    const module = await sampleCodeImporters[lang]();
    return module.default;
  })
);
