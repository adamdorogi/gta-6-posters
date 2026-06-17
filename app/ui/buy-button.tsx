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
      className="flex h-14 w-full max-w-md items-center justify-center gap-3 rounded-full bg-zinc-900 dark:bg-white px-8 text-white dark:text-black font-bold text-lg transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.98] shadow-xl"
    >
      <span>Buy {size}</span>
      <span className="opacity-70">/ ${(price / 100).toFixed(2)}</span>
    </button>
  );
}
