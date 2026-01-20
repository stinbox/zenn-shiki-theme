import { Suspense } from "react";
import { useAtomValue } from "jotai";
import { selectedLanguageAtom } from "../atoms/language";
import { shikiHighlightedCodeAtomFamily } from "../atoms/shiki";
import { CodeBlockSkeleton } from "./CodeBlockSkeleton";
import { useScrollSync } from "../hooks/useScrollSync";

function ShikiCodeContent() {
  const language = useAtomValue(selectedLanguageAtom);
  const highlightedHtml = useAtomValue(
    shikiHighlightedCodeAtomFamily(language)
  );
  const { containerRef, handleScroll } = useScrollSync("shiki");

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="znc overflow-auto h-[600px]"
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  );
}

export function ShikiCodeBlock() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          Shiki (zenn theme)
        </span>
      </div>
      <Suspense fallback={<CodeBlockSkeleton />}>
        <ShikiCodeContent />
      </Suspense>
    </div>
  );
}
