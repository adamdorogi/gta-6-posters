import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import MetaPixel from "./utils/meta-pixel";
import TikTokPixel from "./utils/tiktok-pixel";
import { products } from "./utils/pricing";
import { DefaultTemplateString } from "next/dist/lib/metadata/types/metadata-types";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  style: ["italic", "normal"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Turn Royal", template: "%s | Turn Royal" },
  description: "Customized Canvas Printing",
  metadataBase: new URL("https://www.turnroyal.com"),
  openGraph: { siteName: "Turn Royal" },
  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: (metadata.title as DefaultTemplateString).default,
    url: metadata.metadataBase,
    description: metadata.description,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: products.Digital.price / 100,
      priceCurrency: "AUD",
      description: "Digital download of your AI portrait",
    },
  };

  return (
    <html
      lang="en"
      className={`${merriweather.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
        <MetaPixel />
        <TikTokPixel />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
