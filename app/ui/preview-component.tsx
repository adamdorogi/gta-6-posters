"use client";

import PreviewGallery from "./preview-gallery";
import SuccessHandler from "./success-handler";
import FaqSection from "./faq-section";
import BuySection from "./buy-section";
import { useState } from "react";

export default function PreviewComponent({
  generations,
  styles,
  generationGroupId,
  styleId,
  userPrompt,
}: {
  generations: {
    publicUrl: string | null;
    id: string;
    status: "failed" | "in_progress" | "succeeded";
    path: string | null;
    generation_groups: {
      style_id: string;
      user_prompt: string;
    };
  }[];
  styles: { id: string; name: string }[];
  generationGroupId: string;
  styleId: string;
  userPrompt: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(generations.length - 1);

  return (
    <main className="flex flex-1 w-full mx-auto flex-col items-center bg-background">
      <PreviewGallery
        generations={generations}
        styles={styles}
        generationGroupId={generationGroupId}
        styleId={styleId}
        userPrompt={userPrompt}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
      <BuySection selectedGeneration={generations[selectedIndex]} />
      <FaqSection />
      <BuySection selectedGeneration={generations[selectedIndex]} />
      <SuccessHandler />
    </main>
  );
}
