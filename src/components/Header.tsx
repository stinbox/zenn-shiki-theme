import { useAtom } from "jotai";
import { selectedLanguageAtom } from "../atoms/language";
import {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "../constants/languages";

export function Header() {
  const [language, setLanguage] = useAtom(selectedLanguageAtom);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          Shiki vs Prism.js Comparison
        </h1>
        <div className="flex items-center gap-2">
          <label htmlFor="language-select" className="text-sm text-gray-600">
            Language:
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
