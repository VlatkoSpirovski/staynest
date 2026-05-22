import { GuestLanguageProvider } from "@/components/guest-language";

export default function StayGuideLayout({ children }: { children: React.ReactNode }) {
  return <GuestLanguageProvider>{children}</GuestLanguageProvider>;
}
