"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import RetryButton from "./retry-button";

const loadingMessages = [
  "Studying your photo...",
  "Sketching the outlines...",
  "Mixing the colours...",
  "Painting the base layers...",
  "Balancing the lighting...",
  "Refining the details...",
  "Adding the finishing touches...",
  "Almost there...",
];

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

  const editDialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isEditModalOpen) editDialog.current?.showModal();
  }, [isEditModalOpen]);

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
  const hasArtwork = Boolean(selectedGeneration?.path && selectedGeneration?.publicUrl);

  return (
    <div className="preview-gallery">
      <div className="preview-art" onContextMenu={(event) => event.preventDefault()}>
        {selectedGeneration?.path && selectedGeneration.publicUrl ? (
          <Image
            src={selectedGeneration.publicUrl}
            alt="Your generated GTA 6-style poster"
            sizes="(min-width: 1024px) 460px, (min-width: 640px) 460px, 92vw"
            fill
            className="object-contain"
            loading="eager"
            fetchPriority="high"
            draggable={false}
          />
        ) : selectedGeneration?.status === "in_progress" ? (
          <>
            <Image
              src="/posters/coast-at-dusk.webp"
              alt="Placeholder Image"
              sizes="460px"
              fill
              className="object-cover opacity-35"
              draggable={false}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <div className="h-2 w-3/4 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary animate-progress" />
              </div>
              <div
                className="loading-copy-window relative mt-4 h-6 w-full overflow-hidden text-sm font-medium sm:text-base"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="loading-copy-track flex flex-col">
                  {loadingMessages
                    .concat(loadingMessages[0])
                    .map((message, index) => (
                      <span
                        key={`${message}-${index}`}
                        className="flex h-6 items-center justify-center text-center font-semibold"
                      >
                        {message}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <span className="absolute inset-0 grid place-items-center p-5 text-center text-sm font-medium text-muted-foreground">
            Generation failed. Please try again.
          </span>
        )}
      </div>

      <div className="preview-toolbar">
        <div className="preview-thumbnails">
          {generations.map((generation, index) => (
            <button
              key={generation.id}
              type="button"
              className="preview-thumbnail"
              aria-pressed={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
              onContextMenu={(event) => event.preventDefault()}
            >
              {generation.publicUrl ? (
                <Image
                  src={generation.publicUrl}
                  alt={`Thumbnail ${index}`}
                  fill
                  className="object-contain"
                  sizes="72px"
                  loading={selectedIndex === index ? "eager" : "lazy"}
                  draggable={false}
                />
              ) : generation.status === "failed" ? (
                <Image src="/warning.svg" alt="Warning Icon" width={18} height={18} />
              ) : (
                <>
                  <Image
                    src="/posters/coast-at-dusk.webp"
                    alt="Placeholder Thumbnail"
                    fill
                    sizes="72px"
                    className="object-cover opacity-40"
                    draggable={false}
                  />
                  <span className="z-10 size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </>
              )}
            </button>
          ))}
        </div>
        {(hasArtwork || selectedGeneration?.status === "failed") && (
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="site-button site-button--outline shrink-0"
          >
            <Image
              src={hasArtwork ? "/edit.svg" : "/retry.svg"}
              alt={hasArtwork ? "Edit Icon" : "Retry Icon"}
              width={16}
              height={16}
            />
            {hasArtwork ? "Edit" : "Retry"}
          </button>
        )}
      </div>

      {isEditModalOpen && (
        <dialog
          ref={editDialog}
          className="edit-dialog"
          aria-labelledby="edit-portrait-title"
          onClose={() => setIsEditModalOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) event.currentTarget.close();
          }}
        >
          <div className="p-5 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <h3 id="edit-portrait-title" className="font-display text-4xl leading-none font-black uppercase">
                Edit Your Poster
              </h3>
              <button
                type="button"
                className="icon-button shrink-0"
                aria-label="Close"
                onClick={() => editDialog.current?.close()}
              >
                <Image src="/cross.svg" alt="" width={16} height={16} loading="eager" />
              </button>
            </div>
            <RetryButton
              generationGroupId={generationGroupId}
              generations={generations}
              styles={styles}
              styleIdProp={styleId}
              userPromptProp={userPrompt}
              onDone={() => editDialog.current?.close()}
            />
          </div>
        </dialog>
      )}
    </div>
  );
}
