"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import RetryButton from "./retry-button";

export default function PreviewGallery({
  generations,
  styles,
  generationGroupId,
  styleId,
  userPrompt,
  selectedIndex,
  setSelectedIndex,
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
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const inProgressIndex = generations.findLastIndex(
      (g) => g.status === "in_progress",
    );

    if (inProgressIndex !== -1) {
      setSelectedIndex(inProgressIndex);
    }
  }, [generations, setSelectedIndex]);

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
    <div className="flex flex-col items-center w-full mx-auto bg-white">
      <div className="flex flex-col items-center md:pt-6 pb-2 w-full bg-linear-to-b from-background to-background to-80%">
        {/* Main Image Container */}
        <div
          onContextMenu={(e) => e.preventDefault()}
          className="relative aspect-[3/4] group w-full max-w-full md:max-w-xl overflow-hidden md:rounded-2xl bg-muted mb-2"
        >
          {selectedGeneration?.path && selectedGeneration?.publicUrl ? (
            <>
              <Image
                src={selectedGeneration.publicUrl}
                alt="Generated Image"
                sizes="580px"
                fill
                className="object-cover"
                priority
                loading="eager"
                fetchPriority="high"
                draggable={false}
              />
              {/* Edit Button Overlay */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-ring text-foreground rounded-full text-base font-semibold transition-[scale] duration-200 hover:scale-105 border border-ring cursor-pointer flex items-center gap-1"
              >
                <Image
                  src="/edit.svg"
                  alt="Edit Icon"
                  width={16}
                  height={16}
                  priority
                />
                Edit
              </button>
            </>
          ) : selectedGeneration?.status === "in_progress" ? (
            <>
              <Image
                src={"/placeholder.webp"}
                alt="Placeholder Image"
                sizes="580px"
                fill
                className="object-cover"
                priority
                draggable={false}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3 bg-muted rounded-full overflow-hidden border-2 border-muted">
                  <div className="h-full bg-primary animate-progress" />
                </div>
              </div>
            </>
          ) : (
            <>
              <span className="absolute inset-0 flex items-center justify-center text-base text-center font-medium text-muted-foreground">
                Generation failed. Please try again.
              </span>
              {/* Retry Button Overlay */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-base font-semibold transition-[scale] duration-200 hover:scale-105 border border-primary cursor-pointer flex items-center gap-1"
              >
                <Image
                  src="/retry.svg"
                  alt="Retry Icon"
                  width={16}
                  height={16}
                  priority
                />
                Retry
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        <div className="relative w-full max-w-4xl">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-background to-transparent" />
          <div className="flex flex-nowrap gap-4 overflow-y-hidden px-6 py-4 w-fit max-w-full mx-auto no-scrollbar">
            {generations.map((gen, idx) => (
              <button
                key={gen.id}
                onClick={() => setSelectedIndex(idx)}
                onContextMenu={(e) => e.preventDefault()}
                className={`relative w-16 h-21 shrink-0 rounded-md overflow-hidden transition-[box-shadow,scale] duration-200 cursor-pointer ${
                  selectedIndex === idx
                    ? "ring-2 ring-primary-accent ring-offset-2 ring-offset-primary scale-[1.05]"
                    : "ring-2 ring-border"
                }`}
              >
                {gen.publicUrl ? (
                  <Image
                    src={gen.publicUrl}
                    alt={`Thumbnail ${idx}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                    draggable={false}
                    priority
                  />
                ) : gen.status === "failed" ? (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Image
                      src="/warning.svg"
                      alt="Warning Icon"
                      className="object-cover"
                      width={18}
                      height={18}
                      priority
                      sizes="18px"
                      draggable={false}
                    />
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1/2 aspect-square z-1 animate-spin rounded-full border-2 border-muted border-t-transparent" />
                    </div>
                    <Image
                      src={"/placeholder.webp"}
                      alt="Placeholder Thumbnail"
                      fill
                      className="object-cover"
                      sizes="96px"
                      priority
                      draggable={false}
                    />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-background rounded-3xl p-4 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-foreground">
                Edit Your Portrait
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 w-11 rounded-full hover:bg-muted transition-colors text-muted-foreground cursor-pointer"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
            <RetryButton
              generationGroupId={generationGroupId}
              generations={generations}
              styles={styles}
              styleIdProp={styleId}
              userPromptProp={userPrompt}
              onDone={() => setIsEditModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
