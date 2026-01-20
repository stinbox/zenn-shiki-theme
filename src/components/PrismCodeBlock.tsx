import { Suspense } from "react";
import { useAtomValue } from "jotai";
import { selectedLanguageAtom } from "../atoms/language";
import { prismHighlightedCodeAtomFamily } from "../atoms/prism";
import { CodeBlockSkeleton } from "./CodeBlockSkeleton";
import "zenn-content-css";

function PrismCodeContent() {
  const language = useAtomValue(selectedLanguageAtom);
  const highlightedHtml = useAtomValue(
    prismHighlightedCodeAtomFamily(language),
  );

  return (
    <div className="znc overflow-auto h-[600px]">
      <pre className={`language-${language}`}>
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </pre>
    </div>
  );
}

export function PrismCodeBlock() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          Prism.js (zenn-content-css)
        </span>
      </div>
      <Suspense fallback={<CodeBlockSkeleton />}>
        <PrismCodeContent />
      </Suspense>
    </div>
  );
}
