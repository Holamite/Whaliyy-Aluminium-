import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/wdth.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { JsonLd } from "@/components/JsonLd";
import { business, siteUrl } from "@/content/site";

const title = "Aluminium Doors, Windows & Glass Works in Lagos | Whaliyy Aluminium Concept";
const description =
  "Aluminium fabrication and architectural glass in Lagos: aluminium doors and windows, frameless glass, curtain walls, office partitions, shower cubicles, mirrors, cladding and stainless steel works. Based in Idimu.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${business.name}` },
  description,
  applicationName: business.name,
  keywords: [
    "aluminium fabrication Lagos",
    "aluminium doors and windows Lagos",
    "frameless glass installation Lagos",
    "glass shower cubicles Lagos",
    "curtain wall installation Lagos",
    "office glass partitioning Lagos",
    "aluminium and glass works Idimu",
    "mirrors and architectural glass Lagos",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: business.name,
    title,
    description,
    url: "/",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: `${business.name} — aluminium and glass works in Lagos` }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#30358F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" data-scroll-behavior="smooth">
      <body className="min-h-dvh overflow-x-clip">
        <JsonLd />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
