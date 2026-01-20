import { notFound } from "next/navigation";
import {
  SUPPORTED_LANGUAGES,
  isValidLanguage,
  type SupportedLanguage,
} from "@/constants/languages";
import { highlightWithShiki } from "@/lib/shikiHighlighter";
import { highlightWithPrism } from "@/lib/prismHighlighter";
import { loadSampleCode } from "@/lib/sampleCode";
import { Header } from "@/components/Header";
import { CodeComparison } from "@/components/CodeComparison";

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(({ id }) => ({
    lang: id,
  }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function LanguagePage({ params }: Props) {
  const { lang } = await params;

  if (!isValidLanguage(lang)) {
    notFound();
  }

  const code = await loadSampleCode(lang);
  const shikiHtml = await highlightWithShiki(lang, code);
  const prismHtml = highlightWithPrism(lang, code);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentLang={lang} />
      <main className="container mx-auto px-4 py-6">
        <CodeComparison lang={lang} shikiHtml={shikiHtml} prismHtml={prismHtml} />
      </main>
    </div>
  );
}
