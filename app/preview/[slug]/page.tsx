import BuyButton from "@/app/ui/buy-button";
import RetryButton from "@/app/ui/retry-button";
import { getCredits } from "@/app/utils/credits";
import { supabase } from "@/app/utils/supabase";
import { prices } from "@/app/utils/prices";
import { redirect } from "next/navigation";

import Image from "next/image";

export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const generationGroupId = (await params).slug;
  const [{ data: generations }, { data: styles }] = await Promise.all([
    supabase
      .from("generations")
      .select("id, status, path, generation_groups(style_id, user_prompt)")
      .eq("generation_group_id", generationGroupId),
    supabase.from("styles").select("id, name"),
  ]);

  const credits = await getCredits();

  if (!generations || generations.length === 0) {
    redirect("/");
  }

  const styleId = generations[0].generation_groups.style_id;
  const userPrompt = generations[0].generation_groups.user_prompt;

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
        <p className="mt-3 text-2xl">
          This is the preview page for slug: {generationGroupId}
        </p>
        <p className="mt-3 text-2xl">
          Credits: {credits.credits}, Next Reset:{credits.nextReset}
        </p>
        <ul>
          {generations?.map((generation) => {
            const generationPath = generation.path;
            return (
              <li key={generation.id}>
                <p>
                  {" "}
                  {generation.id}, {generation.status}
                </p>
                {generationPath ? (
                  <>
                    <Image
                      src={
                        supabase.storage
                          .from("watermarked-generations")
                          .getPublicUrl(generationPath).data.publicUrl
                      }
                      alt="Generated Image"
                      width={200}
                      height={200}
                    />
                    {Object.keys(prices).map((size) => (
                      <BuyButton
                        key={size}
                        size={size}
                        price={prices[size]}
                        generationId={generation.id}
                      />
                    ))}
                  </>
                ) : (
                  <label>
                    {generation.status === "failed" ? "Failed:(" : "Loading..."}
                  </label>
                )}
              </li>
            );
          })}
        </ul>
        <RetryButton
          generationGroupId={generationGroupId}
          generations={generations || []}
          styles={styles || []}
          styleIdProp={styleId}
          userPromptProp={userPrompt}
        />
      </main>
    </div>
  );
}
