import { ShikiCodeBlock } from "./ShikiCodeBlock";
import { PrismCodeBlock } from "./PrismCodeBlock";

export function CodeComparison() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ShikiCodeBlock />
      <PrismCodeBlock />
    </div>
  );
}
