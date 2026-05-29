"use client";
import { useRouter } from "next/navigation";

export default function BuyButton({
  generationGroupId,
  generationId,
  imageUrl,
}: {
  generationGroupId: string;
  generationId: string;
  imageUrl: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={async (e) => {
        const resp = await fetch("/api/checkout", {
          method: "POST",
          body: JSON.stringify({ generationId, generationGroupId, imageUrl }),
        });
        const response = await resp.json();
        const { url } = response;
        router.push(url);
      }}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
    >
      Buy
    </button>
  );
}
