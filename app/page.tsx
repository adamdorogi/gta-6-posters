import Image from "next/image";
import GenerationForm from "./ui/generation-form";
import { supabase } from "./utils/supabase";

export default async function Home() {
  const { data: styles } = await supabase.from("styles").select("id, name");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <GenerationForm styles={styles || []} />
      </main>
    </div>
  );
}
