"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BuyButton({
  generationId,
  size,
  price,
  text,
  iconPath,
  iconAlt,
}: {
  generationId: string;
  size: string;
  price: number;
  text: string;
  iconPath: string;
  iconAlt: string;
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
      className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold text-md transition-all hover:opacity-90 active:scale-[0.98] shadow-xl cursor-pointer"
    >
      <Image src={iconPath} alt={iconAlt} width={20} height={20} priority />
      <span>{text}</span>
      <span className="opacity-70">•</span>
      <span className="opacity-70">${price / 100}</span>
    </button>
  );
}
