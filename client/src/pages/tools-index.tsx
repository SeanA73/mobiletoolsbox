import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Drill, ArrowRight } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { TOOL_SEO, SITE_URL, SITE_NAME } from "@/lib/tool-seo";

export default function ToolsIndex() {
  const canonical = `${SITE_URL}/tools`;

  useSeo({
    title: "Free Online Tools — Calculators, Converters & More | MobileToolsBox",
    description:
      "A free collection of online productivity and utility tools: calculator, password generator, QR scanner, unit converter, timers, and more. No sign-up needed.",
    keywords:
      "free online tools, productivity tools, utility tools, online calculator, password generator, qr scanner",
    canonical,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Free Online Tools",
        url: canonical,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        hasPart: TOOL_SEO.map((t) => ({
          "@type": "WebApplication",
          name: t.name,
          url: `${SITE_URL}/tools/${t.slug}`,
          applicationCategory: "UtilitiesApplication",
        })),
      },
    ],
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Drill className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">{SITE_NAME}</span>
            </Link>
            <Button asChild>
              <Link href="/app">Open App</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Free Online Tools</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A growing collection of free productivity and utility tools that run right in your
            browser — no downloads, no sign-up, no clutter.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOL_SEO.map((t) => (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="block group">
              <Card className="hover:shadow-lg transition-all h-full hover:border-primary/20">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 group-hover:text-primary transition-colors mb-2 flex items-center justify-between">
                    {t.name}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{t.tagline}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center text-sm text-slate-500">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">·</span>
          <Link href="/privacy" className="hover:text-primary">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
