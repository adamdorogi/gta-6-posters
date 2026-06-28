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
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      <PromoBanner />
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-primary text-white">
          <section className="max-w-5xl mx-auto w-full grid lg:grid-cols-12 items-stretch">
            <div className="flex min-w-0 flex-col gap-8 justify-center items-center text-center py-6 md:py-10 lg:col-span-7 lg:items-start lg:text-left">
              <div className="px-12 flex flex-col gap-6 items-center lg:items-start">
                <h1 className="text-4xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
                  Turn your loved ones into a{" "}
                  <span className="text-accent italic">masterpiece!</span>
                </h1>
                <p className="text-lg text-white/80 max-w-xl leading-relaxed">
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
                      className="flex items-center gap-3 text-white/80 font-medium"
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

        {/* Trust Bar */}
        <section className="bg-primary text-white py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 text-center font-medium">
            <div className="flex items-center gap-2">
              <span>⭐⭐⭐⭐⭐</span>
              <span>5,000+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🚚</span>
              <span>Fast Global Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🛡️</span>
              <span>100% Satisfaction Guarantee</span>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section
          id="how-it-works"
          className="px-6 py-24 max-w-7xl mx-auto w-full"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Creating your royal masterpiece is simple and takes only a few
              minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Upload Your Photo",
                description:
                  "Pick a clear photo of your person, pet, or favorite memory. The better the photo, the better the art!",
                icon: "📸",
              },
              {
                step: "2",
                title: "Choose Your Style",
                description:
                  "Select from our curated collection of royal styles to match the personality of your subject.",
                icon: "👑",
              },
              {
                step: "3",
                title: "Receive Your Canvas",
                description:
                  "Our AI and artists create your portrait, which is then printed on premium canvas and shipped to your door.",
                icon: "🖼️",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-white border border-border shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl mb-2 relative">
                  {item.icon}
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
