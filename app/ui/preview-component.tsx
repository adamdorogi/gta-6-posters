"use client";

import PreviewGallery from "./preview-gallery";
import OrderConfirmation from "./order-confirmation";
import FaqSection from "./faq-section";
import BuySection from "./buy-section";
import { useState } from "react";
import ShowcaseSection from "./showcase-section";
import MockupSection from "./mockup-section";
import type { StoreCurrency } from "../utils/pricing";

export default function PreviewComponent({
  generations,
  styles,
  generationGroupId,
  styleId,
  userPrompt,
  currency,
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
  currency: StoreCurrency;
}) {
  const [selectedIndex, setSelectedIndex] = useState(generations.length - 1);

  return (
    <main className="flex w-full flex-1 flex-col items-center bg-background">
      <OrderConfirmation />
      <div className="preview-stage w-full">
        <div className="site-container preview-layout">
          <PreviewGallery
            generations={generations}
            styles={styles}
            generationGroupId={generationGroupId}
            styleId={styleId}
            userPrompt={userPrompt}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
          <BuySection selectedGeneration={generations[selectedIndex]} currency={currency} position="beside-artwork" />
        </div>
      </div>
      <MockupSection hideScrollButton={true} />
      <ShowcaseSection />
      <FaqSection currency={currency} />
      <BuySection selectedGeneration={generations[selectedIndex]} currency={currency} />
    </main>
  );
}
