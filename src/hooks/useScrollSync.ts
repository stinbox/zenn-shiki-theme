"use client";

import { useEffect, useRef, useCallback } from "react";
import { atom, useAtom } from "jotai";

const scrollPositionAtom = atom({ top: 0, left: 0 });
const scrollSourceAtom = atom<string | null>(null);

export function useScrollSync(id: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useAtom(scrollPositionAtom);
  const [scrollSource, setScrollSource] = useAtom(scrollSourceAtom);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (scrollSource === null || scrollSource === id) {
      setScrollSource(id);
      setScrollPosition({
        top: container.scrollTop,
        left: container.scrollLeft,
      });

      setTimeout(() => {
        setScrollSource(null);
      }, 50);
    }
  }, [id, scrollSource, setScrollPosition, setScrollSource]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (scrollSource !== null && scrollSource !== id) {
      container.scrollTop = scrollPosition.top;
      container.scrollLeft = scrollPosition.left;
    }
  }, [scrollPosition, scrollSource, id]);

  return { containerRef, handleScroll };
}
