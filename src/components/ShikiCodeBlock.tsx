"use client";

import { useScrollSync } from "@/hooks/useScrollSync";

type Props = {
  html: string;
};

export function ShikiCodeBlock({ html }: Props) {
  const { containerRef, handleScroll } = useScrollSync("shiki");

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          Shiki (zenn theme)
        </span>
      </div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="znc overflow-auto h-[600px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
