import Logo from "@/app/ui/logo";
import PreviewGallery from "@/app/ui/preview-gallery";
import SuccessHandler from "@/app/ui/success-handler";
import { getCredits } from "@/app/utils/credits";
import { supabase } from "@/app/utils/supabase";
import { redirect } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const generationGroupId = (await params).slug;
  const [{ data: generations }, { data: styles }, credits] = await Promise.all([
    supabase
      .from("generations")
      .select("id, status, path, generation_groups(style_id, user_prompt)")
      .eq("generation_group_id", generationGroupId),
    supabase
      .from("styles")
      .select("id, name")
      .order("rank", { ascending: true }),
    getCredits(),
  ]);

  const generationsWithUrls = generations?.map((gen) => ({
    ...gen,
    publicUrl: gen.path
      ? supabase.storage.from("watermarked-generations").getPublicUrl(gen.path)
          .data.publicUrl
      : null,
  }));

  if (!generations || generations.length === 0) {
    redirect("/");
  }

  const styleId = generations[0].generation_groups.style_id;
  const userPrompt = generations[0].generation_groups.user_prompt;

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <main className="flex flex-1 w-full max-w-5xl mx-auto flex-col items-center py-12 px-6 bg-background">
        <div className="flex flex-col items-center gap-4 mb-12">
          <Logo />
          <div className="text-center">
            <p className="mt-1 text-muted-foreground">
              Credits:{" "}
              <span className="font-bold text-foreground">
                {credits.credits}
              </span>{" "}
              • Next Reset: {credits.nextReset}
            </p>
          </div>
        </div>

        <PreviewGallery
          generations={generationsWithUrls || []}
          styles={styles || []}
          generationGroupId={generationGroupId}
          styleIdProp={styleId}
          userPromptProp={userPrompt}
        />
        <SuccessHandler />
      </main>
    </div>
  );
}
