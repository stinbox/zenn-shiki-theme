"use client";

import { useScrollSync } from "@/hooks/useScrollSync";
import type { SupportedLanguage } from "@/constants/languages";
import "zenn-content-css";

type Props = {
  lang: SupportedLanguage;
  html: string;
};

export function PrismCodeBlock({ lang, html }: Props) {
  const { containerRef, handleScroll } = useScrollSync("prism");

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          Prism.js (zenn-content-css)
        </span>
      </div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="znc overflow-auto h-[600px]"
      >
        <pre className={`language-${lang}`}>
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>
    </div>
  );
}
