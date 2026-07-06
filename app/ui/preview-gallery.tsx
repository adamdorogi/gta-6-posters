"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BuyButton from "./buy-button";
import RetryButton from "./retry-button";
import { products, sale } from "@/app/utils/pricing";

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
  const [selectedIndex, setSelectedIndex] = useState(generations.length - 1);
  const [prevGenerations, setPrevGenerations] = useState(generations);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [selectedSize, setSelectedSize] = useState<string>(
    Object.keys(products)[0],
  );
  const router = useRouter();

  if (generations !== prevGenerations) {
    setPrevGenerations(generations);
    const inProgressIndex = generations.findLastIndex(
      (g) => g.status === "in_progress",
    );
    if (inProgressIndex !== -1) {
      setSelectedIndex(inProgressIndex);
    }
  }

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
    <div className="flex flex-col items-center gap-12 w-full max-w-4xl mx-auto">
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Main Image Container */}
        <div
          onContextMenu={(e) => e.preventDefault()}
          className="relative aspect-[3/4] group w-full max-w-xl overflow-hidden rounded-2xl bg-muted shadow-2xl border border-border"
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
              />
              {/* Edit Button Overlay */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-ring text-foreground rounded-full text-md font-semibold transition-all duration-300 hover:scale-105 shadow-xl border border-ring cursor-pointer flex items-center gap-1"
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
          ) : (
            <>
              <Image
                src={"/placeholder.webp"}
                alt="Placeholder Image"
                sizes="580px"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3 bg-muted rounded-full overflow-hidden border-2 border-muted">
                  <div className="h-full bg-primary animate-progress" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-4 overflow-x-auto p-2 w-full justify-center no-scrollbar">
          {generations.map((gen, idx) => (
            <button
              key={gen.id}
              onClick={() => setSelectedIndex(idx)}
              onContextMenu={(e) => e.preventDefault()}
              className={`relative w-16 aspect-[3/4] rounded-md overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                selectedIndex === idx
                  ? "border-primary scale-110 shadow-md"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              {gen.publicUrl ? (
                <Image
                  src={gen.publicUrl}
                  alt={`Thumbnail ${idx}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : gen.status === "failed" ? (
                <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] text-center p-1 font-medium text-muted-foreground">
                  Failed.
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1/2 aspect-square z-1 animate-spin rounded-full border-2 border-muted border-t-transparent" />
                  </div>
                  <Image
                    src={"/placeholder.webp"}
                    alt="Placeholder Image"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight text-foreground leading-tight">
          Get Your Portrait Now
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
          No watermark • Instant download
        </p>
      </div>

      {/* Buy Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[720px]">
        {/* Physical Canvas Section */}
        <div className="relative flex flex-col items-center gap-6 p-4 pt-8 rounded-2xl border border-border bg-background/50 shadow-sm h-fit">
          <div className="absolute text-nowrap -top-3 left-1/2 -translate-x-1/2 px-5 py-1 bg-ring text-foreground text-md font-bold rounded-full shadow-sm">
            {sale.name} - {sale.discount}% OFF
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-serif font-bold text-foreground">
              Canvas + Digital Download
            </h3>
            <div className="flex-1 flex gap-3 py-2 items-center justify-center">
              <div className="text-center">
                <span className="text-2xl font-bold text-muted-foreground line-through">
                  $
                  {Math.round(
                    products[selectedSize].price / (100 - sale.discount) / 10,
                  ) *
                    10 -
                    1}
                </span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold text-foreground">
                  ${products[selectedSize].price / 100}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-md">
              Canvas delivered to your wall & instant digital download after
              purchase
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 justify-between items-center w-full">
              <span className="text-muted-foreground text-md">
                Choose a size:
              </span>
              <div className="flex self-end justify-center p-1 rounded-full bg-muted">
                <button
                  onClick={() => setUnit("in")}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                    unit === "in"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  in
                </button>
                <button
                  onClick={() => setUnit("cm")}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                    unit === "cm"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  cm
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 w-full">
              {selectedGeneration?.path &&
                Object.keys(products)
                  .filter((size) => size !== "Digital")
                  .map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative flex flex-col items-center justify-center px-2 py-3 rounded-lg border transition-all active:scale-[0.98] cursor-pointer ${
                        selectedSize === size
                          ? "border-primary bg-muted shadow-sm"
                          : "border-border bg-background"
                      }`}
                    >
                      {size === "Medium" && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full whitespace-nowrap shadow-sm">
                          Popular
                        </span>
                      )}
                      {size === "Large" && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-ring text-foreground text-[10px] font-bold rounded-full whitespace-nowrap shadow-sm">
                          Best Value
                        </span>
                      )}
                      <span className="text-sm font-bold text-foreground">
                        {unit === "in"
                          ? products[size].width
                          : Math.floor(products[size].width * 2.54)}{" "}
                        ×{" "}
                        {unit === "in"
                          ? products[size].height
                          : Math.floor(products[size].height * 2.54)}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        ${products[size].price / 100}
                      </span>
                    </button>
                  ))}
            </div>
          </div>
          <ul className="flex flex-col gap-2 w-full mx-auto text-left">
            {[
              "Museum quality canvas print",
              `Free digital download worth $${products["Digital"].price / 100}`,
              "No watermarks",
              "Ready to hang - kit included",
              "Free shipping",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-md text-foreground"
              >
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          {selectedGeneration?.path && (
            <BuyButton
              size={selectedSize}
              price={products[selectedSize].price}
              generationId={selectedGeneration.id}
              text="Download now + Canvas"
              iconPath="/box.svg"
              iconAlt="Buy Icon"
            />
          )}
        </div>

        {/* Digital Download Section */}
        <div className="relative flex flex-col items-center gap-6 p-4 pt-8 rounded-2xl border border-border bg-background/50 shadow-sm h-fit">
          <div className="absolute text-nowrap -top-3 left-1/2 -translate-x-1/2 px-5 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-sm">
            Prefer digital only?
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-serif font-bold text-foreground">
              Digital Download
            </h3>
            <div className="flex-1 flex gap-3 py-2 items-center justify-center">
              <div className="text-center">
                <span className="text-2xl font-bold text-muted-foreground line-through">
                  ${products["Digital"].price / 100 + 10}
                </span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold text-foreground">
                  ${products["Digital"].price / 100}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              No physical print — digital file only
            </p>
          </div>
          <ul className="flex flex-col gap-2 w-full mx-auto text-left">
            {[
              "No watermarks",
              "Instant download",
              "High-resolution digital file",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-md text-foreground"
              >
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          {selectedGeneration?.path && (
            <BuyButton
              size="Digital"
              price={products["Digital"].price}
              generationId={selectedGeneration.id}
              text="Download"
              iconPath="/download.svg"
              iconAlt="Download Icon"
            />
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background rounded-3xl p-4 w-full max-w-md shadow-2xl border border-border animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-foreground">
                Edit your portrait
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
              styleIdProp={styleIdProp}
              userPromptProp={userPromptProp}
              onDone={() => setIsEditModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
