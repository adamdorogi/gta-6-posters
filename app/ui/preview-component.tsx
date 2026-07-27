"use client";

import PreviewGallery from "./preview-gallery";
import OrderConfirmation from "./order-confirmation";
import FaqSection from "./faq-section";
import BuySection from "./buy-section";
import { useState } from "react";
import ReactionsSection from "./reactions-section";

export default function PreviewComponent({
  generations,
  styles,
  generationGroupId,
  styleId,
  userPrompt,
  videoFiles,
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
  videoFiles: string[];
}) {
  const [selectedIndex, setSelectedIndex] = useState(generations.length - 1);

  return (
    <main className="flex flex-1 w-full mx-auto flex-col items-center bg-background">
      <OrderConfirmation />
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
      <ReactionsSection videoFiles={videoFiles} />
      <FaqSection />
      <BuySection selectedGeneration={generations[selectedIndex]} />
    </main>
  );
}
