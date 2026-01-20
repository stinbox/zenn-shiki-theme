"use client";

import { ShikiCodeBlock } from "./ShikiCodeBlock";
import { PrismCodeBlock } from "./PrismCodeBlock";
import type { SupportedLanguage } from "@/constants/languages";

type Props = {
  lang: SupportedLanguage;
  shikiHtml: string;
  prismHtml: string;
};

export function CodeComparison({ lang, shikiHtml, prismHtml }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ShikiCodeBlock html={shikiHtml} />
      <PrismCodeBlock lang={lang} html={prismHtml} />
    </div>
  );
}
