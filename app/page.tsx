import Logo from "@/app/ui/logo";
import GenerationForm from "./ui/generation-form";
import ShowcaseCarousel from "./ui/showcase-carousel";
import { supabase } from "./utils/supabase";
import fs from "fs/promises";
import path from "path";

export default async function Home() {
  const { data: styles } = await supabase
    .from("styles")
    .select("id, name")
    .order("rank", { ascending: true });

  const showcaseDir = path.join(process.cwd(), "public/showcase");
  let showcaseImages: string[] = [];
  try {
    const files = await fs.readdir(showcaseDir);
    showcaseImages = files
      .filter(
        (file) =>
          file.endsWith(".webp") ||
          file.endsWith(".jpg") ||
          file.endsWith(".png"),
      )
      .map((file) => `/showcase/${file}`);
  } catch (error) {
    console.error("Error reading showcase directory:", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans dark:bg-zinc-950">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12 max-w-7xl mx-auto w-full gap-12">
        {/* Left Column: Value Proposition & Form */}
        <div className="flex-1 flex flex-col gap-12 max-w-2xl">
          <div className="flex flex-col gap-6">
            <h1 className="text-6xl md:text-7xl font-serif font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
              Turn Your Photos <br />
              <span className="text-zinc-500 dark:text-zinc-400 italic">
                into Royal Art
              </span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
              Create a timeless masterpiece. Upload your photos, choose a royal
              style, and receive a museum-quality canvas that captures your
              essence in regal splendor.
            </p>
          </div>

          <div className="w-full p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <GenerationForm styles={styles || []} />
          </div>

          <div className="flex flex-wrap gap-8 justify-center md:justify-start">
            {[
              { text: "Museum Quality Canvas", icon: "✨" },
              { text: "Hand-Finished Details", icon: "🎨" },
              { text: "Secure Global Shipping", icon: "📦" },
            ].map((benefit, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 font-medium"
              >
                <span className="text-xl">{benefit.icon}</span>
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Showcase Carousel */}
        <div className="flex-1 hidden lg:block h-[700px]">
          <ShowcaseCarousel images={showcaseImages} />
        </div>
      </main>

      <footer className="py-12 px-6 text-center text-sm text-zinc-500 dark:text-zinc-500">
        © {new Date().getFullYear()} AI Canvas. All rights reserved.
      </footer>
    </div>
  );
}
