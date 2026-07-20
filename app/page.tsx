import PromoBanner from "./ui/promo-banner";
import GenerationForm from "./ui/generation-form";
import ShowcaseCarousel from "./ui/showcase-carousel";
import { supabase } from "./utils/supabase";
import { getShowcaseImages } from "./utils/showcase";
import Image from "next/image";
import NavBar from "./ui/nav-bar";
import Footer from "./ui/footer";
import ScrollToTopButton from "@/app/ui/scroll-to-top-button";
import FaqItem from "./ui/faq-item";

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
        <div
          id="create"
          className="bg-linear-135 from-gradient-light to-gradient-dark text-primary-foreground"
        >
          <section className="max-w-5xl mx-auto w-full grid lg:grid-cols-12 items-stretch">
            <div className="flex min-w-0 flex-col gap-6 justify-center items-center text-center py-6 md:py-8 lg:col-span-7 lg:items-start lg:text-left">
              <div className="px-12 flex flex-col gap-2 items-center lg:items-start">
                <h1 className="text-4xl lg:text-6xl/17 italic font-serif font-black tracking-tight text-primary-foreground leading-tight">
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
                      className="flex items-center gap-3 text-sm text-muted"
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

        {/* Features Section */}
        <section
          id="features"
          className="bg-linear-135 from-gradient-light to-gradient-dark py-16 mx-auto bg-muted w-full text-primary-foreground"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-4xl font-serif italic font-black mb-4">
              Why customers love <span className="text-accent">Turn Royal</span>
            </h2>
            <p className="text-md max-w-xl mx-auto">
              See your royal portrait in seconds — free preview, no card needed
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
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
                  className="flex items-center gap-3 rounded-2xl bg-primary-foreground p-5 text-left"
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={56}
                    height={56}
                  />
                  <div className="min-w-0">
                    <h3 className="text-md font-bold leading-tight text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
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
        <section id="qa" className="px-6 py-16 mx-auto bg-muted w-full">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-4xl font-serif italic font-black text-foreground mb-4">
              Questions & <span className="text-accent-dark">Answers</span>
            </h2>
            <div className="mt-10 mx-auto max-w-3xl text-left">
              <FaqItem
                question="How does it work?"
                answer="Upload your photo, pick a style, and our AI creates your portrait in seconds. Free preview — no card needed."
              />
              <FaqItem
                question="Is my photo good enough?"
                answer="Any well-lit photo works great. We recommend clear, front-facing photos for best results. Both phone and camera photos work perfectly."
              />
              <FaqItem
                question="What are credits?"
                answer="Credits let you generate AI portraits. You get free credits to start, which refresh every 12 hours. Each generation uses one credit."
              />
              <FaqItem
                question="How to edit the preview?"
                answer="You can click the “Edit” button to regenerate the portrait, with the option to change the portrait style or provide specific instructions and adjustments you would like made to the artwork. Please make sure your instructions are direct, clear, and detailed so the system can better understand what changes need to be made."
              />
              <FaqItem
                question="Can I include pets or groups?"
                answer="Absolutely! We support pets, couples, families, and groups. Just upload a photo with everyone in it and choose the right category."
              />
              <FaqItem
                question="How will the final portrait look?"
                answer="Your final physical canvas will be printed vertically and will look the same as the preview you are purchasing. Please note that, during the canvas wrapping process, the outer edges of the artwork are wrapped around the sides of the canvas frame. Because of this, a small portion near the edges of the image may not be fully visible from the front once printed. Aside from this standard canvas wrapping adjustment, the final portrait will match the preview shown. If you have any questions or would like confirmation of how your final portrait will appear before printing, please contact our customer support team at hello@turnroyal.com."
              />
              <FaqItem
                question="Digital File vs Physical Canvas – What’s the Difference?"
                answer="Please note that digital files will usually appear more vibrant, brighter, and more colorful when viewed on screens such as phones, computers, tablets, or laptops. This is because every screen has its own color calibration, brightness, and display settings, which can enhance how colors appear digitally. Physical canvases are professionally printed, but printed colors naturally appear slightly different compared to backlit digital screens. As a result, the physical canvas may look a bit darker or less vibrant than the digital preview you see on your device. This is a normal difference between digital displays and printed materials and applies to most printed artwork and photography products."
              />
              <FaqItem
                question="How long does delivery take?"
                answer="Digital downloads are instant after purchase. Canvas prints are sent to production after purchase and the delivery takes 5-10 business days with standard shipping."
              />
              <FaqItem
                question="What's the refund policy after the portrait is delivered?"
                answer="We want to ensure that you are happy with your portrait. However, if you are not satisfied with the received item, please contact our customer support team at hello@turnroyal.com within 14 days of delivery so we can assist you further."
              />
              <FaqItem
                question="The portrait damaged or lost?"
                answer="Please contact our customer support team at hello@turnroyal.com within 14 days of delivery if you would like to request a replacement. Kindly make sure to include clear photos showing the issue so we can assist you further."
              />
              <FaqItem
                question="What are the prices?"
                answer="You can find the prices and offers for our products once you create your free preview and scroll down."
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
