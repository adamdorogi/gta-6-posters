import BuyButton from "@/app/ui/buy-button";
import RetryButton from "@/app/ui/retry-button";
import { getCredits } from "@/app/utils/credits";
import { supabase } from "@/app/utils/supabase";
import { prices } from "@/app/utils/prices";

import Image from "next/image";

export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const generationGroupId = (await params).slug;
  const { data, error } = await supabase
    .from("generations")
    .select("id, status, path")
    .eq("generation_group_id", generationGroupId);

  const credits = await getCredits();

  const { data: generationGroupData, error: generationGroupError } =
    await supabase
      .from("generation_groups")
      .select("style_id, user_prompt")
      .eq("id", generationGroupId)
      .single();
  const styleId = generationGroupData?.style_id;
  const userPrompt = generationGroupData?.user_prompt;

  const { data: styles, error: stylesError } = await supabase
    .from("styles")
    .select("id, name");

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
          {data?.map((generation) => (
            <li key={generation.id}>
              <p>
                {" "}
                {generation.id}, {generation.status}
              </p>
              {generation.path ? (
                <>
                  <Image
                    src={
                      supabase.storage
                        .from("watermarked-generations")
                        .getPublicUrl(generation.path).data.publicUrl
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
                      generationGroupId={generationGroupId}
                      generationId={generation.id}
                      imageUrl={
                        supabase.storage
                          .from("watermarked-generations")
                          .getPublicUrl(generation.path).data.publicUrl
                      }
                    />
                  ))}
                </>
              ) : (
                <label>
                  {generation.status === "failed" ? "Failed:(" : "Loading..."}
                </label>
              )}
            </li>
          ))}
        </ul>
        <RetryButton
          generationGroupId={generationGroupId}
          generations={data || []}
          styles={styles || []}
          styleIdProp={styleId}
          userPromptProp={userPrompt}
        />
      </main>
    </div>
  );
}
