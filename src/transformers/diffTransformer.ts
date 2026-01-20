/**
 * Shiki diff transformer
 *
 * zenn-editor/packages/zenn-markdown-html/src/utils/highlight.ts からコピー
 */

import type { ShikiTransformer } from "shiki";

/**
 * diff プレフィックスの定義
 * Prism.js の diff-highlight プラグインと互換性を持たせる
 */
const DIFF_PREFIXES = {
  // 削除行
  "-": "remove", // deleted-sign
  "<": "remove", // deleted-arrow
  // 挿入行
  "+": "add", // inserted-sign
  ">": "add", // inserted-arrow
} as const;

/** コンテキスト行（変更なし）のプレフィックス */
const DIFF_CONTEXT_PREFIX = " ";

/**
 * 行の最初の文字（diff プレフィックス）を別の span 要素にラップする
 * これにより CSS で user-select: none を適用可能になる
 */
function wrapDiffPrefix(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lineNode: any,
  prefix: string
): void {
  const line = lineNode;

  if (!line.children || line.children.length === 0) return;

  const firstChild = line.children[0];

  // 最初の子要素がテキストノードの場合（実際には発生しないはずだが念の為）
  if (firstChild.type === "text" && firstChild.value.startsWith(prefix)) {
    // プレフィックスを分離
    const prefixSpan = {
      type: "element",
      tagName: "span",
      properties: { class: "diff-prefix" },
      children: [{ type: "text", value: prefix }],
    };
    firstChild.value = firstChild.value.slice(1);

    // 空になった場合は削除
    if (firstChild.value === "") {
      line.children.shift();
    }

    // プレフィックス span を先頭に挿入
    line.children.unshift(prefixSpan);
    return;
  }

  // 最初の子要素が element（span など）の場合
  if (
    firstChild.type === "element" &&
    firstChild.children &&
    firstChild.children.length > 0
  ) {
    const innerFirst = firstChild.children[0];
    if (innerFirst.type === "text" && innerFirst.value.startsWith(prefix)) {
      // プレフィックスを分離
      const prefixSpan = {
        type: "element",
        tagName: "span",
        properties: { class: "diff-prefix" },
        children: [{ type: "text", value: prefix }],
      };
      innerFirst.value = innerFirst.value.slice(1);

      // 空になった場合は削除
      if (innerFirst.value === "") {
        firstChild.children.shift();
      }

      // プレフィックス span を先頭に挿入
      line.children.unshift(prefixSpan);
    }
  }
}

/**
 * diff 行スタイルを適用する transformer を作成
 * 行頭のプレフィックス (+, -, <, >, スペース) を検出して処理
 * - +, -, <, >: 挿入/削除のクラスを追加し、プレフィックスをラップ
 * - スペース: プレフィックスのみラップ（コンテキスト行）
 */
export function createDiffTransformer(): ShikiTransformer {
  return {
    line(node, lineNumber) {
      // ソースコードの該当行を取得
      const lines = this.source.split("\n");
      const lineText = lines[lineNumber - 1] ?? "";
      const firstChar = lineText.charAt(0);

      if (firstChar in DIFF_PREFIXES) {
        // 追加/削除行
        this.addClassToHast(node, "diff");
        this.addClassToHast(
          node,
          DIFF_PREFIXES[firstChar as keyof typeof DIFF_PREFIXES]
        );
        wrapDiffPrefix(node, firstChar);
      } else if (firstChar === DIFF_CONTEXT_PREFIX) {
        // コンテキスト行（先頭スペース）
        wrapDiffPrefix(node, firstChar);
      }
    },
  };
}
