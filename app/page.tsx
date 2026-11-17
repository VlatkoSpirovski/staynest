import { LandingPage } from "@/components/landing-page";
import { landingCopy } from "@/lib/landing-copy";
import { HOME_LANGUAGES, pageMetadata } from "@/lib/seo";

const copy = landingCopy.en;

export const metadata = pageMetadata({
  title: copy.meta.title,
  description: copy.meta.description,
  keywords: copy.meta.keywords,
  path: "/",
  locale: "en",
  languages: HOME_LANGUAGES,
  absoluteTitle: true
});

export default function HomePage() {
  return <LandingPage copy={copy} />;
}
