import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import MetaPixel from "./utils/meta-pixel";
import TikTokPixel from "./utils/tiktok-pixel";
import { products } from "./utils/pricing";
import { DefaultTemplateString } from "next/dist/lib/metadata/types/metadata-types";
import { getUserId } from "@/app/utils/user";

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
  description:
    "Turn your pet photos into a timeless royal portrait, printed in Australia. Preview it in seconds, then order a premium canvas or 12K digital download.",
  metadataBase: new URL("https://www.turnroyal.com"),
  openGraph: { siteName: "Turn Royal" },
  alternates: {
    canonical: "./",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${metadata.metadataBase}#website`,
        name: (metadata.title as DefaultTemplateString).default,
        url: metadata.metadataBase,
        description: metadata.description,
      },
      {
        "@type": "WebApplication",
        "@id": `${metadata.metadataBase}#webapplication`,
        name: (metadata.title as DefaultTemplateString).default,
        url: metadata.metadataBase,
        description: metadata.description,
        applicationCategory: "DesignApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: products.Digital.price / 100,
          priceCurrency: "AUD",
          description: "Digital download of your royal portrait",
        },
      },
    ],
  };

  const userId = await getUserId();

  return (
    <html
      lang="en"
      className={`${merriweather.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
        <MetaPixel userId={userId} />
        <TikTokPixel userId={userId} />
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
