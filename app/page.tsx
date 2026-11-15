import PromoBanner from "./ui/promo-banner";
import GenerationForm from "./ui/generation-form";
import ShowcaseCarousel from "./ui/showcase-carousel";
import { supabase } from "./utils/supabase";
import { heroPosters } from "./utils/showcase";
import Image from "next/image";
import NavBar from "./ui/nav-bar";
import Footer from "./ui/footer";
import ScrollToTopButton from "@/app/ui/scroll-to-top-button";
import QASection from "./ui/faq-section";
import TryFreeSection from "./ui/try-free-section";
import { Metadata } from "next";
import ShowcaseSection from "./ui/showcase-section";
import MockupSection from "./ui/mockup-section";
import { site } from "./utils/site";

export const metadata: Metadata = {
  title: { absolute: `Custom Posters From Your Photos | ${site.name}` },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Make a Custom GTA 6-Style Poster",
    description: site.description,
    siteName: site.name,
    type: "website",
    url: "/",
  },
};

const websiteUrl = new URL("/", site.origin).href;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${websiteUrl}#website`,
      url: websiteUrl,
      name: site.name,
      description: site.description,
      publisher: { "@id": `${websiteUrl}#store` },
    },
    {
      "@type": "OnlineStore",
      "@id": `${websiteUrl}#store`,
      url: websiteUrl,
      name: site.name,
      email: site.email,
      logo: new URL("/icon-512.png", site.origin).href,
    },
  ],
};

const features = [
  {
    title: "Start for free",
    caption:
      "Get 5 free credits every 12 hours, so you can explore different styles before ordering.",
    icon: "/add.svg",
  },
  {
    title: "Three poster styles",
    caption:
      "Choose comic-book Cover Art, a cinematic Character poster, or The Album’s sunset artwork.",
    icon: "/sparkle.svg",
  },
  {
    title: "Bring your crew",
    caption: "Start with a selfie, a couple’s photo, or a group shot. Pets can join in, too.",
    icon: "/frame.svg",
  },
  {
    title: "Worldwide shipping",
    caption: "Get your custom poster delivered or choose a high-resolution digital download.",
    icon: "/box.svg",
  },
];

export default async function Home() {
  const { data: styles } = await supabase
    .from("styles")
    .select("id, name")
    .order("rank", { ascending: true });

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <PromoBanner />
      <NavBar />

      <main className="flex-1">
        <section id="create" className="hero">
          <div className="site-container hero-layout">
            <div className="hero-copy">
              <div className="hero-intro mb-6 md:mb-8">
                <h1 className="hero-title">
                  Turn your photo into a <span>GTA 6 poster</span>
                </h1>
                <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-balance text-muted-foreground md:text-base">
                  Upload a selfie or group photo and preview your custom GTA 6-style poster for free.
                </p>
              </div>

              <GenerationForm styles={styles || []} />

              <div className="hero-visual--mobile">
                <ShowcaseCarousel images={heroPosters} layout="horizontal" />
              </div>

              <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground md:mt-6 md:text-sm">
                {["Free Preview", "No Signup", "Three Art Styles"].map((benefit) => (
                  <li key={benefit} className="inline-flex items-center gap-1.5">
                    <Image src="/tick.svg" alt="Tick Icon" width={13} height={13} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero-visual--desktop">
              <ShowcaseCarousel images={heroPosters} />
            </div>
          </div>
        </section>

        <MockupSection />
        <ShowcaseSection />

        <section id="features" className="site-section border-y border-border bg-surface">
          <div className="site-container grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-x-20">
            <div className="self-start">
              <h2 className="section-title">
                A poster that <span className="text-primary">looks like you</span>
              </h2>
              <p className="section-lead mt-4">
                Bring your favorite photo to Vice City with illustrated artwork made for your wall.
              </p>
            </div>

            <ul className="divide-y divide-border border-y border-border lg:row-span-2">
              {features.map((feature) => (
                <li key={feature.title} className="grid grid-cols-[2rem_1fr] gap-4 py-4 md:py-5">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={22}
                    height={22}
                    className="mt-1 brightness-0 invert"
                  />
                  <div>
                    <h3 className="font-display text-2xl leading-none font-bold uppercase">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.caption}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="lg:self-end">
              <ScrollToTopButton>
                <Image src="/sparkle.svg" alt="Sparkle Icon" width={20} height={20} />
                Create My Free Preview
              </ScrollToTopButton>
            </div>
          </div>
        </section>

        <QASection />
        <TryFreeSection />
      </main>
      <Footer />
    </div>
  );
}
