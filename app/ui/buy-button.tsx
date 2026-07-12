"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { event as metaEvent } from "@/app/utils/meta-pixel-events";
import { event as tikTokEvent } from "@/app/utils/tiktok-pixel-events";

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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <button
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        const metaEventId = crypto.randomUUID();
        metaEvent(
          "InitiateCheckout",
          {
            content_ids: ["personalised-canvas"],
            content_name: "Personalised Canvas",
            content_type: "product",
            currency: "AUD",
            value: price / 100,
            num_items: 1,
          },
          { eventID: metaEventId },
        );
        tikTokEvent("InitiateCheckout", {
          content_ids: ["personalised-canvas"],
          content_name: "Personalised Canvas",
          content_type: "product",
          contents: [
            {
              content_id: "personalised-canvas",
              content_type: "product",
              content_name: "Personalised Canvas",
              price: price / 100,
              quantity: 1,
            },
          ],
          value: price / 100,
          currency: "AUD",
          num_items: 1,
        });
        const resp = await fetch("/api/checkout", {
          method: "POST",
          body: JSON.stringify({
            generationId,
            size,
            eventId: metaEventId,
          }),
        });
        const response = await resp.json();
        const { url } = response;
        router.push(url);
      }}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold text-md transition-all hover:opacity-90 active:scale-[0.98] shadow-xl cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          <Image src={iconPath} alt={iconAlt} width={20} height={20} priority />
          <span>{text}</span>
          <span className="opacity-70">•</span>
          <span className="opacity-70">${price / 100}</span>
        </>
      )}
    </button>
  );
}
