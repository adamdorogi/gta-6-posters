import PromoBanner from "./ui/promo-banner";
import GenerationForm from "./ui/generation-form";
import ShowcaseCarousel from "./ui/showcase-carousel";
import { supabase } from "./utils/supabase";
import { getShowcaseImages } from "./utils/showcase";
import Image from "next/image";
import NavBar from "./ui/nav-bar";
import Footer from "./ui/footer";
import ScrollToTopButton from "@/app/ui/scroll-to-top-button";
import QASection from "./ui/faq-section";
import { Metadata } from "next";
import ReactionsSection from "./ui/reactions-section";
import { products } from "./utils/pricing";
import { metadata as defaultMetadata } from "./layout";
import { DefaultTemplateString } from "next/dist/lib/metadata/types/metadata-types";
import { getVideoFiles } from "./utils/videos";

export const metadata: Metadata = {
  title: "Get Turned Into Royalty | Turn Royal",
};

export default async function Home() {
  const { data: styles } = await supabase
    .from("styles")
    .select("id, name")
    .order("rank", { ascending: true });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: (defaultMetadata.title as DefaultTemplateString).default,
    url: defaultMetadata.metadataBase,
    description: defaultMetadata.description,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: products.Digital.price / 100,
      priceCurrency: "AUD",
      description: "Digital download of your AI portrait",
    },
  };

  const showcaseImages = await getShowcaseImages();

  return (
    <div className="flex flex-col min-h-screen font-sans text-foreground">
      <PromoBanner />
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <div
          id="create"
          className="bg-linear-135 from-gradient-light to-gradient-dark text-primary-foreground"
        >
          <section className="max-w-5xl mx-auto w-full grid lg:grid-cols-12 items-stretch">
            <div className="flex min-w-0 flex-col gap-4 lg:gap-6 justify-center items-center text-center py-4 lg:py-8 lg:col-span-7 lg:items-start lg:text-left">
              <div className="px-4 lg:px-12 max-w-4xl flex flex-col gap-2 items-center lg:items-start">
                <h1 className="text-4xl lg:text-6xl/17 italic font-serif font-black tracking-tight text-primary-foreground leading-tight">
                  Turn your loved ones into a{" "}
                  <span className="text-accent">masterpiece!</span>
                </h1>
                <p className="text-sm lg:text-base text-muted leading-relaxed">
                  Free Preview · No credit card or registration required
                </p>
              </div>

              <GenerationForm styles={styles || []} />

              <div className="lg:hidden relative h-[200px] overflow-hidden w-full">
                <div className="absolute inset-0">
                  <ShowcaseCarousel
                    images={showcaseImages}
                    layout="horizontal"
                  />
                </div>
              </div>

              <div className="px-4 lg:px-12 max-w-4xl flex flex-wrap gap-6 justify-center lg:justify-start">
                {["Free preview", "No signup", "Private & secure"].map(
                  (benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-xs md:text-sm text-muted"
                    >
                      <Image
                        src="/tick.svg"
                        alt="Tick Icon"
                        width={12}
                        height={12}
                        priority
                      />
                      <span>{benefit}</span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="hidden lg:block relative overflow-hidden lg:col-span-5">
              <div className="pr-12 absolute inset-0">
                <ShowcaseCarousel images={showcaseImages} />
              </div>
            </div>
          </section>
        </div>

        {/* Reactions Section */}
        <ReactionsSection videoFiles={await getVideoFiles()} />

        {/* Features Section */}
        <section
          id="features"
          className="bg-linear-135 from-gradient-light to-gradient-dark py-10 md:py-16 px-4 md:px-8 mx-auto bg-muted w-full text-primary-foreground"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-serif italic font-black mb-2 md:mb-3">
              Why customers love <span className="text-accent">Turn Royal</span>
            </h2>
            <p className="text-base max-w-xl mx-auto">
              See your royal portrait in seconds — free preview, no card needed
            </p>

            <div className="mt-4 md:mt-8 grid gap-2 md:gap-4 md:grid-cols-2">
              {[
                {
                  title: "Start for free",
                  caption:
                    "Get 5 free credits — no card needed, resets every 12 hours. Create your first portraits right now.",
                  image: "/feature-free.png",
                },
                {
                  title: "AI magic",
                  caption:
                    "Stunning portraits in seconds. Made to make you look legendary.",
                  image: "/feature-magic.png",
                },
                {
                  title: "Works with any photo",
                  caption:
                    "Pets, people, couples, families — any photo becomes a masterpiece.",
                  image: "/feature-photo.png",
                },
                {
                  title: "Free shipping on prints",
                  caption:
                    "Premium canvas prints shipped free. Museum-worthy quality, guaranteed.",
                  image: "/feature-shipping.png",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-4 rounded-2xl bg-primary-foreground p-4 md:p-5 text-left"
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={64}
                    height={64}
                  />
                  <div className="min-w-0">
                    <h3 className="text-base font-bold leading-tight text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-5 text-foreground">
                      {feature.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <ScrollToTopButton>
              <Image
                src="/sparkle.svg"
                alt="Sparkle Icon"
                width={24}
                height={24}
                priority
                className="invert"
              />
              Create your portrait — free preview
            </ScrollToTopButton>
          </div>
        </section>

        {/* Q&A Section */}
        <QASection />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
