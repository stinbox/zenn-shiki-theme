export const SUPPORTED_LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "rust", label: "Rust" },
  { id: "go", label: "Go" },
  { id: "java", label: "Java" },
  { id: "c", label: "C" },
  { id: "cpp", label: "C++" },
  { id: "csharp", label: "C#" },
  { id: "ruby", label: "Ruby" },
  { id: "php", label: "PHP" },
  { id: "swift", label: "Swift" },
  { id: "kotlin", label: "Kotlin" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "json", label: "JSON" },
  { id: "yaml", label: "YAML" },
  { id: "markdown", label: "Markdown" },
  { id: "sql", label: "SQL" },
  { id: "bash", label: "Bash" },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]["id"];

export const DEFAULT_LANGUAGE: SupportedLanguage = "typescript";

export const LANGUAGE_IDS = SUPPORTED_LANGUAGES.map((l) => l.id);

export function isValidLanguage(lang: string | null): lang is SupportedLanguage {
  return lang !== null && LANGUAGE_IDS.includes(lang as SupportedLanguage);
}
