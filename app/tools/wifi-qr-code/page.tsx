import Link from "next/link";
import { JsonLd } from "@/components/seo-jsonld";
import { MarketingShell, TrialCallout } from "@/components/marketing-shell";
import { WifiQrGenerator } from "@/components/wifi-qr-generator";
import { getSiteUrl } from "@/lib/utils";

const title = "Free Wi-Fi QR code generator for guests";
const description =
  "Create a free Wi-Fi QR code your guests scan to join the network: no app, no typing. Made in your browser, so your password never leaves your device. Ideal for Airbnb and holiday rentals.";

const faq = [
  {
    question: "How do guests use the Wi-Fi QR code?",
    answer: "They open the camera on their phone, point it at the code and tap the “Join network” prompt. Current iPhones and most Android phones support this without an extra app."
  },
  {
    question: "Is my Wi-Fi password sent anywhere?",
    answer: "No. This generator creates the QR code with JavaScript in your browser. Nothing you type is sent to StayNest or stored."
  },
  {
    question: "What happens when I change my Wi-Fi password?",
    answer: "The old QR code stops working. Generate a new one with the new password and replace the printed code."
  },
  {
    question: "How big should I print it?",
    answer: "About 5–6 cm wide or larger is easy to scan from a normal distance. Test it with two different phones before guests arrive."
  }
];

export const metadata = {
  title: { absolute: "Free Wi-Fi QR Code Generator for Airbnb & Guests · StayNest" },
  description,
  alternates: { canonical: "/tools/wifi-qr-code" },
  openGraph: { title, description, url: "/tools/wifi-qr-code" }
};

export default function WifiQrToolPage() {
  const siteUrl = getSiteUrl();

  return (
    <MarketingShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "StayNest Wi-Fi QR code generator",
            url: `${siteUrl}/tools/wifi-qr-code`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } }))
          }
        ]}
      />
      <div className="mx-auto max-w-4xl px-5 py-10 lg:py-14">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F9287]">Free tool</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#172033]/78">
          Guests scan it with their camera and join your Wi-Fi in one tap. No typing, no mixed-up characters, no late-night messages about the password.
        </p>

        <div className="mt-8">
          <WifiQrGenerator />
        </div>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">How to use it in your rental</h2>
          <ol className="mt-4 grid list-decimal gap-2 pl-6 text-base leading-7 text-[#172033]/80">
            <li>Enter your network name exactly as it appears, including capital letters.</li>
            <li>Enter the password and choose the security type; most routers use WPA/WPA2.</li>
            <li>Download the PNG and print it about 5–6 cm wide or larger.</li>
            <li>Test it with an iPhone and an Android phone.</li>
            <li>Place it next to the router, on the fridge or in your welcome book.</li>
          </ol>
          <p className="mt-4 text-base leading-8 text-[#172033]/80">
            More tips in our guide: <Link href="/guides/wifi-qr-code-for-guests" className="font-semibold text-[#3F6F6B] underline">How to share your Wi-Fi with guests using a QR code</Link>.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-4 grid gap-3">
            {faq.map((item) => (
              <details key={item.question} className="rounded-[16px] border border-[#D8D1C4]/60 bg-white px-5 py-4">
                <summary className="cursor-pointer list-none font-semibold [&::-webkit-details-marker]:hidden">{item.question}</summary>
                <p className="mt-3 text-base leading-7 text-[#172033]/78">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <TrialCallout title="Wi-Fi is just the first question guests ask" />
      </div>
    </MarketingShell>
  );
}
