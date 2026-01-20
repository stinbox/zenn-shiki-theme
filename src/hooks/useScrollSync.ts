import { useEffect, useRef, useCallback } from "react";
import { atom, useAtom } from "jotai";

// スクロール位置を共有するatom
const scrollPositionAtom = atom({ top: 0, left: 0 });

// どのコンテナがスクロール中かを追跡（無限ループ防止）
const scrollSourceAtom = atom<string | null>(null);

export function useScrollSync(id: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useAtom(scrollPositionAtom);
  const [scrollSource, setScrollSource] = useAtom(scrollSourceAtom);

  // スクロールイベントハンドラ
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // 自分がスクロール元の場合のみ位置を更新
    if (scrollSource === null || scrollSource === id) {
      setScrollSource(id);
      setScrollPosition({
        top: container.scrollTop,
        left: container.scrollLeft,
      });

      // スクロール終了後にソースをリセット
      setTimeout(() => {
        setScrollSource(null);
      }, 50);
    }
  }, [id, scrollSource, setScrollPosition, setScrollSource]);

  // 他のコンテナからのスクロール位置を反映
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 自分がスクロール元でない場合のみ同期
    if (scrollSource !== null && scrollSource !== id) {
      container.scrollTop = scrollPosition.top;
      container.scrollLeft = scrollPosition.left;
    }
  }, [scrollPosition, scrollSource, id]);

  return { containerRef, handleScroll };
}
