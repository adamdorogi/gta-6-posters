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
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
    >
      Buy ({size}, ${price / 100})
    </button>
  );
}
