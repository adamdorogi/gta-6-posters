import Footer from "@/app/ui/footer";
import NavBar from "@/app/ui/nav-bar";
import { supabase } from "@/app/utils/supabase";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import PreviewComponent from "@/app/ui/preview-component";
import { getShowcaseImages } from "@/app/utils/showcase";

export const metadata: Metadata = {
  title: "Your Royal Portrait",
};

export default async function Preview({
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
      <PreviewComponent
        generations={generationsWithUrls || []}
        styles={styles || []}
        generationGroupId={generationGroupId}
        styleId={styleId}
        userPrompt={userPrompt}
        portraitFiles={await getShowcaseImages()}
      />
      <Footer />
    </div>
  );
}
