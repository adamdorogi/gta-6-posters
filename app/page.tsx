import PromoBanner from "./ui/promo-banner";
import GenerationForm from "./ui/generation-form";
import ShowcaseCarousel from "./ui/showcase-carousel";
import { supabase } from "./utils/supabase";
import { getShowcaseImages } from "./utils/showcase";
import Image from "next/image";
import NavBar from "./ui/nav-bar";
import Footer from "./ui/footer";

export default async function Home() {
  const { data: styles } = await supabase
    .from("styles")
    .select("id, name")
    .order("rank", { ascending: true });

  const showcaseImages = await getShowcaseImages();

  return (
    <div className="flex flex-col min-h-screen font-sans text-foreground">
      <PromoBanner />
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-linear-135 from-gradient-light to-gradient-dark text-white">
          <section className="max-w-5xl mx-auto w-full grid lg:grid-cols-12 items-stretch">
            <div className="flex min-w-0 flex-col gap-6 justify-center items-center text-center py-6 md:py-8 lg:col-span-7 lg:items-start lg:text-left">
              <div className="px-12 flex flex-col gap-2 items-center lg:items-start">
                <h1 className="text-4xl lg:text-6xl/17 italic font-serif font-black tracking-tight text-white leading-tight">
                  Turn your loved ones into a{" "}
                  <span className="text-accent">masterpiece!</span>
                </h1>
                <p className="text-md text-muted max-w-xl leading-relaxed">
                  Free Preview · No credit card or registration required
                </p>
              </div>

              <GenerationForm styles={styles || []} />

              <div className="lg:hidden relative h-[220px] overflow-hidden w-full">
                <div className="absolute inset-0">
                  <ShowcaseCarousel
                    images={showcaseImages}
                    layout="horizontal"
                  />
                </div>
              </div>

              <div className="px-12 flex flex-wrap gap-6 justify-center lg:justify-start">
                {["Free preview", "No signup", "Private & secure"].map(
                  (benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm text-muted font-medium"
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
        <section id="reactions" className="px-6 py-8 mx-auto bg-muted w-full">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex w-fit mx-auto opacity-80 items-center gap-1 px-4 py-1 rounded-full bg-border text-primary text-sm font-medium mb-6">
              <span className="font-bold uppercase">Reactions</span>
            </div>
            <h2 className="text-4xl md:text-4xl font-serif italic font-black text-foreground mb-4">
              See why they cry happy tears
            </h2>
            <p className="text-md text-muted-foreground max-w-2xl mx-auto">
              From thousands of unboxing moments
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
