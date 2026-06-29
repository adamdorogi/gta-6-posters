"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BuyButton from "./buy-button";
import RetryButton from "./retry-button";
import { prices } from "@/app/utils/pricing";

type Generation = {
  publicUrl: string | null;
  id: string;
  status: "failed" | "in_progress" | "succeeded";
  path: string | null;
  generation_groups: {
    style_id: string;
    user_prompt: string;
  };
};
type Style = { id: string; name: string };

export default function PreviewGallery({
  generations,
  styles,
  generationGroupId,
  styleIdProp,
  userPromptProp,
}: {
  generations: Generation[];
  styles: Style[];
  generationGroupId: string;
  styleIdProp: string;
  userPromptProp: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(
    Object.keys(prices)[0],
  );
  const router = useRouter();

  const inProgress = generations.filter(
    (generation) => generation.status === "in_progress",
  );

  useEffect(() => {
    if (inProgress.length === 0) return;

    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/status", {
          method: "POST",
          body: JSON.stringify({
            generationIds: inProgress.map((g) => g.id),
          }),
        });

        const json = await res.json();
        console.log("Polling...", JSON.stringify(json));

        const shouldRefresh = json.status.some(
          (s: { id: string; status: string }) => s.status !== "in_progress",
        );

        if (shouldRefresh) {
          router.refresh();
          return;
        }
      } catch (err) {
        console.error(err);
      }

      if (!cancelled) {
        setTimeout(poll, 2000);
      }
    }

    poll();

    return () => {
      cancelled = true;
    };
  }, [router, inProgress]);

  const selectedGeneration = generations[selectedIndex];

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-4xl mx-auto py-12 px-4">
      {/* Main Image Container */}
      <div className="relative group w-full max-w-xl overflow-hidden rounded-3xl bg-muted shadow-2xl border border-border">
        {selectedGeneration?.path && selectedGeneration?.publicUrl ? (
          <>
            <Image
              src={selectedGeneration.publicUrl}
              alt="Generated Image"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
              priority
            />
            {/* Edit Button Overlay */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-background/90 backdrop-blur-md text-foreground rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 shadow-xl border border-border"
            >
              Edit
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground font-medium">
            {selectedGeneration?.status === "failed"
              ? "Failed to generate"
              : "Loading..."}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto p-2 w-full justify-center no-scrollbar">
        {generations.map((gen, idx) => (
          <button
            key={gen.id}
            onClick={() => setSelectedIndex(idx)}
            className={`relative w-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              selectedIndex === idx
                ? "border-primary scale-110 shadow-md"
                : "border-transparent opacity-50 hover:opacity-100"
            }`}
          >
            {gen.publicUrl ? (
              <Image
                src={gen.publicUrl}
                alt={`Thumbnail ${idx}`}
                width={96}
                height={0}
                style={{ width: "96px", height: "auto" }}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] text-center p-1 font-medium text-muted-foreground">
                {gen.status === "failed" ? "Failed" : "Loading"}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Buy Buttons */}
      <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            Purchase High-Res Image
          </h3>
          <p className="text-muted-foreground text-sm">
            Select a size to download your generation without watermarks
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          {selectedGeneration?.path &&
            Object.keys(prices).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border transition-all active:scale-[0.98] ${
                  selectedSize === size
                    ? "border-primary bg-muted shadow-sm"
                    : "border-border bg-background opacity-60 hover:opacity-100"
                }`}
              >
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {size}
                </span>
                <span className="text-lg font-bold text-foreground">
                  ${(prices[size] / 100).toFixed(2)}
                </span>
              </button>
            ))}
        </div>
        {selectedGeneration?.path && (
          <BuyButton
            size={selectedSize}
            price={prices[selectedSize]}
            generationId={selectedGeneration.id}
          />
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background rounded-3xl p-8 w-full max-w-md shadow-2xl border border-border animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-foreground">
                Edit Generation
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
            <div className="flex flex-col gap-6">
              <RetryButton
                generationGroupId={generationGroupId}
                generations={generations}
                styles={styles}
                styleIdProp={styleIdProp}
                userPromptProp={userPromptProp}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
