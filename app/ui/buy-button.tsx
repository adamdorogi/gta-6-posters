"use client";
import { useRouter } from "next/navigation";

export default function BuyButton({
  generationId,
  size,
  price,
}: {
  generationId: string;
  size: string;
  price: number;
}) {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        const resp = await fetch("/api/checkout", {
          method: "POST",
          body: JSON.stringify({
            generationId,
            size,
          }),
        });
        const response = await resp.json();
        const { url } = response;
        router.push(url);
      }}
      className="flex h-14 w-full max-w-md items-center justify-center gap-3 rounded-full bg-primary text-primary-foreground font-bold text-lg transition-all hover:opacity-90 active:scale-[0.98] shadow-xl"
    >
      <span>Buy {size}</span>
      <span className="opacity-70">/ ${(price / 100).toFixed(2)}</span>
    </button>
  );
}
