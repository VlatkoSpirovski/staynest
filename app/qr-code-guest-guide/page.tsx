import { SolutionPageView } from "@/components/solution-page";
import { pageMetadata } from "@/lib/seo";
import { solutionPages } from "@/lib/solution-pages";

const page = solutionPages.qr;

export const metadata = pageMetadata({ title: page.metaTitle, description: page.description, path: page.path });

export default function Page() {
  return <SolutionPageView page={page} />;
}
