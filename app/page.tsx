import Logo from "@/app/ui/logo";
import GenerationForm from "./ui/generation-form";
import ShowcaseCarousel from "./ui/showcase-carousel";
import { supabase } from "./utils/supabase";
import { getShowcaseImages } from "./utils/showcase";

export default async function Home() {
  const { data: styles } = await supabase
    .from("styles")
    .select("id, name")
    .order("rank", { ascending: true });

  const showcaseImages = await getShowcaseImages();

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a
            href="#how-it-works"
            className="hover:text-primary transition-colors"
          >
            How it Works
          </a>
          <a href="#reviews" className="hover:text-primary transition-colors">
            Reviews
          </a>
          <a href="#faq" className="hover:text-primary transition-colors">
            FAQ
          </a>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-primary leading-tight">
                Turn Your Loved Ones <br />
                <span className="text-accent italic">into Royalty</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                The perfect unique gift for any occasion. We transform your
                favorite photos into museum-quality royal portraits on canvas
                that capture the essence of your loved ones in regal splendor.
              </p>
            </div>

            <div className="w-full p-6 md:p-8 rounded-3xl bg-muted border border-border shadow-sm">
              <GenerationForm styles={styles || []} />
            </div>

            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              {[
                { text: "Museum Quality Canvas", icon: "✨" },
                { text: "Hand-Finished Details", icon: "🎨" },
                { text: "Secure Global Shipping", icon: "📦" },
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-muted-foreground font-medium"
                >
                  <span className="text-xl">{benefit.icon}</span>
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block h-[600px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
            <ShowcaseCarousel images={showcaseImages} />
          </div>
        </section>

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

        {/* Final CTA / Showcase for Mobile */}
        <section className="px-6 py-12 lg:hidden max-w-7xl mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-primary">
              See the Magic
            </h2>
          </div>
          <div className="h-[400px] rounded-3xl overflow-hidden shadow-lg">
            <ShowcaseCarousel images={showcaseImages} />
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-border text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex justify-center gap-6 mb-4 font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary">
              Shipping Info
            </a>
          </div>
          <p>
            © {new Date().getFullYear()} AI Canvas. Crafting timeless memories.
          </p>
        </div>
      </footer>
    </div>
  );
}
