import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { JsonLd } from "@/components/seo-jsonld";
import { MarketingShell, TrialCallout } from "@/components/marketing-shell";
import { getGuide, guides } from "@/lib/guides-content";
import { getSiteUrl } from "@/lib/utils";

type PageProps = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({ params }: PageProps) {
  const guide = getGuide(params.slug);
  if (!guide) return {};
  return {
    title: { absolute: `${guide.metaTitle} · StayNest` },
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { type: "article", title: guide.metaTitle, description: guide.description, url: `/guides/${guide.slug}`, modifiedTime: guide.updated },
    twitter: { title: guide.metaTitle, description: guide.description }
  };
}

function anchor(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function GuidePage({ params }: PageProps) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/guides/${guide.slug}`;
  const related = guide.related.map(getGuide).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const updatedLabel = new Date(guide.updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <MarketingShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            dateModified: guide.updated,
            datePublished: guide.updated,
            mainEntityOfPage: url,
            author: { "@type": "Organization", name: "StayNest", url: siteUrl },
            publisher: { "@type": "Organization", name: "StayNest", logo: { "@type": "ImageObject", url: `${siteUrl}/staynest-logo.png` } }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: guide.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } }))
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
              { "@type": "ListItem", position: 2, name: "Guides", item: `${siteUrl}/guides` },
              { "@type": "ListItem", position: 3, name: guide.title, item: url }
            ]
          }
        ]}
      />
      <article className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-[#172033]/60">
          <ol className="flex flex-wrap gap-1">
            <li><Link href="/" className="hover:underline">Home</Link> /</li>
            <li><Link href="/guides" className="hover:underline">Guides</Link> /</li>
            <li aria-current="page" className="text-[#172033]/80">{guide.category}</li>
          </ol>
        </nav>

        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{guide.title}</h1>
        <p className="mt-3 text-sm text-[#172033]/60">
          Updated {updatedLabel} · {guide.readMinutes} min read
        </p>

        <div className="mt-6 grid gap-4 text-lg leading-8 text-[#172033]/82">
          {guide.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <nav aria-label="On this page" className="mt-8 rounded-[18px] border border-[#D8D1C4]/60 bg-white p-5">
          <p className="text-sm font-bold">On this page</p>
          <ol className="mt-2 grid gap-1 text-sm">
            {guide.sections.map((section) => (
              <li key={section.heading}>
                <a href={`#${anchor(section.heading)}`} className="text-[#3F6F6B] hover:underline">{section.heading}</a>
              </li>
            ))}
            <li><a href="#faq" className="text-[#3F6F6B] hover:underline">Frequently asked questions</a></li>
          </ol>
        </nav>

        {guide.sections.map((section) => (
          <section key={section.heading} id={anchor(section.heading)} className="mt-10 scroll-mt-6">
            <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-base leading-8 text-[#172033]/80">{paragraph}</p>
            ))}
            {section.list ? (
              <ul className="mt-4 grid list-disc gap-2 pl-6 text-base leading-7 text-[#172033]/80">
                {section.list.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : null}
            {section.steps ? (
              <ol className="mt-4 grid list-decimal gap-2 pl-6 text-base leading-7 text-[#172033]/80">
                {section.steps.map((item) => <li key={item}>{item}</li>)}
              </ol>
            ) : null}
            {section.template ? (
              <div className="mt-5 overflow-hidden rounded-[18px] border border-[#D8D1C4]/70 bg-white">
                <div className="flex items-center justify-between gap-3 border-b border-[#D8D1C4]/60 px-4 py-2">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6F9287]">Template</span>
                  <CopyButton value={section.template} label="Copy" copiedLabel="Copied" className="min-h-9 rounded-full border border-[#D8D1C4]/70 bg-white px-3 text-xs text-[#172033]" />
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap p-4 font-mono text-[13px] leading-6 text-[#172033]/85">{section.template}</pre>
              </div>
            ) : null}
          </section>
        ))}

        <section id="faq" className="mt-12 scroll-mt-6">
          <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-4 grid gap-3">
            {guide.faq.map((item) => (
              <details key={item.question} className="group rounded-[16px] border border-[#D8D1C4]/60 bg-white px-5 py-4">
                <summary className="cursor-pointer list-none font-semibold [&::-webkit-details-marker]:hidden">{item.question}</summary>
                <p className="mt-3 text-base leading-7 text-[#172033]/78">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <TrialCallout />

        {related.length ? (
          <section className="mt-12">
            <h2 className="text-lg font-bold">Related guides</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/guides/${item.slug}`} className="block h-full rounded-[16px] border border-[#D8D1C4]/60 bg-white p-4 text-sm font-semibold leading-6 hover:shadow-[0_12px_32px_rgba(23,32,51,0.08)]">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </MarketingShell>
  );
}
