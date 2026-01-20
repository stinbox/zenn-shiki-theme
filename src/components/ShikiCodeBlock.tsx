import { Suspense } from "react";
import { useAtomValue } from "jotai";
import { selectedLanguageAtom } from "../atoms/language";
import { shikiHighlightedCodeAtomFamily } from "../atoms/shiki";
import { CodeBlockSkeleton } from "./CodeBlockSkeleton";

function ShikiCodeContent() {
  const language = useAtomValue(selectedLanguageAtom);
  const highlightedHtml = useAtomValue(
    shikiHighlightedCodeAtomFamily(language)
  );

  return (
    <div
      className="overflow-auto h-[600px] text-sm [&>pre]:p-4 [&>pre]:m-0"
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  );
}

export function ShikiCodeBlock() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          Shiki (nord theme)
        </span>
      </div>
      <Suspense fallback={<CodeBlockSkeleton />}>
        <ShikiCodeContent />
      </Suspense>
    </div>
  );
}
