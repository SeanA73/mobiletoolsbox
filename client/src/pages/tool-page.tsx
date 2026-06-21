import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Drill, ArrowRight, Check, ChevronRight } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { TOOL_SEO, getToolSeo, SITE_URL, SITE_NAME } from "@/lib/tool-seo";
import NotFound from "@/pages/not-found";

export default function ToolPage() {
  const params = useParams();
  const slug = params.slug || "";
  const tool = getToolSeo(slug);

  if (!tool) {
    return <NotFound />;
  }

  const canonical = `${SITE_URL}/tools/${tool.slug}`;
  const appUrl = `/app?tool=${tool.appToolId}`;

  // Structured data: describe the tool as a WebApplication + an FAQPage.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      url: canonical,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: tool.description,
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
        { "@type": "ListItem", position: 3, name: tool.name, item: canonical },
      ],
    },
  ];

  useSeo({
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    canonical,
    jsonLd,
  });

  // A few related tools for internal linking (skip the current one).
  const related = TOOL_SEO.filter((t) => t.slug !== tool.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
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
              <Link href={appUrl}>Open Tool</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-6">
          <ol className="flex items-center space-x-1">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li><Link href="/tools" className="hover:text-primary">Tools</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li className="text-slate-700" aria-current="page">{tool.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{tool.name}</h1>
          <p className="text-xl text-slate-600">{tool.tagline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button size="lg" asChild>
              <Link href={appUrl} className="flex items-center space-x-2">
                <span>Open {tool.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-600" /> Free</span>
              <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-600" /> No sign-up</span>
              <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-600" /> In your browser</span>
            </div>
          </div>
        </header>

        {/* Body copy */}
        <section className="prose prose-slate max-w-none mb-10">
          {tool.body.map((para, i) => (
            <p key={i} className="text-slate-700 leading-relaxed mb-4">{para}</p>
          ))}
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {tool.faq.map((f, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-slate-900 mb-2">{f.q}</h3>
                  <p className="text-slate-600">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Secondary CTA */}
        <section className="mb-10 text-center bg-white border border-slate-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to try it?</h2>
          <p className="text-slate-600 mb-5">Open {tool.name} now — free, no account needed.</p>
          <Button size="lg" asChild>
            <Link href={appUrl} className="flex items-center space-x-2">
              <span>Open {tool.name}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </section>

        {/* Related tools (internal linking) */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">More free tools</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/tools/${r.slug}`}
                className="block group"
              >
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors mb-1">
                      {r.name}
                    </h3>
                    <p className="text-sm text-slate-600">{r.tagline}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center text-sm text-slate-500">
          <Link href="/tools" className="hover:text-primary">All tools</Link>
          <span className="mx-2">·</span>
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">·</span>
          <Link href="/privacy" className="hover:text-primary">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
