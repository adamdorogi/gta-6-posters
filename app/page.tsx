import Image from "next/image";
import GenerationForm from "./ui/generation-form";
import { supabase } from "./utils/supabase";

export default async function Home() {
  const { data: styles } = await supabase.from("styles").select("id, name");

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Logo"
            width={80}
            height={16}
            priority
          />
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <a
            href="#"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Gallery
          </a>
          <a
            href="#"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Pricing
          </a>
        </div>
        <button className="px-4 py-2 text-sm font-medium rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity">
          Get Started
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 max-w-5xl mx-auto w-full text-center">
        {/* Hero Section */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
            Transform your photos <br />
            <span className="text-zinc-500 dark:text-zinc-400">
              with the power of AI
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
            Upload your images, pick a style, and let our AI create something
            extraordinary. Fast, intuitive, and stunning results in seconds.
          </p>
        </div>

        {/* Generation Form Container */}
        <div className="w-full max-w-2xl p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800">
          <GenerationForm styles={styles || []} />
        </div>
      </main>

      <footer className="py-12 px-6 text-center text-sm text-zinc-500 dark:text-zinc-500">
        © {new Date().getFullYear()} AI Canvas. All rights reserved.
      </footer>
    </div>
  );
}
