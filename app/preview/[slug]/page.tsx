import NavBar from "@/app/ui/nav-bar";
import PreviewGallery from "@/app/ui/preview-gallery";
import SuccessHandler from "@/app/ui/success-handler";
import { supabase } from "@/app/utils/supabase";
import { redirect } from "next/navigation";

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
      .eq("generation_group_id", generationGroupId)
      .order("created_at", { ascending: true }),
    supabase
      .from("styles")
      .select("id, name")
      .order("rank", { ascending: true }),
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
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      <NavBar />
      <main className="flex flex-1 w-full max-w-5xl mx-auto flex-col items-center py-4 px-6 bg-background">
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
