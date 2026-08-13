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
  disabled = false,
}: {
  generationId: string;
  size: string;
  price: number;
  text: string;
  iconPath: string;
  iconAlt: string;
  disabled?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <button
      disabled={isLoading || disabled}
      onClick={async () => {
        setIsLoading(true);
        const metaEventId = crypto.randomUUID();
        const tikTokEventId = crypto.randomUUID();
        metaEvent(
          "InitiateCheckout",
          {
            content_ids: [`personalised-canvas-${size}`],
            content_name: `Personalised Canvas ${size}`,
            content_type: "product",
            currency: "AUD",
            value: price / 100,
            num_items: 1,
          },
          { eventID: metaEventId },
        );
        tikTokEvent(
          "InitiateCheckout",
          {
            content_ids: [`personalised-canvas-${size}`],
            content_name: `Personalised Canvas ${size}`,
            content_type: "product",
            contents: [
              {
                content_id: `personalised-canvas-${size}`,
                content_name: `Personalised Canvas ${size}`,
                content_type: "product",
                price: price / 100,
                quantity: 1,
                brand: "Turn Royal",
              },
            ],
            value: price / 100,
            currency: "AUD",
            num_items: 1,
          },
          { event_id: tikTokEventId },
        );
        const resp = await fetch("/api/checkout", {
          method: "POST",
          body: JSON.stringify({
            generationId,
            size,
            metaEventId,
            tikTokEventId,
          }),
        });
        const response = await resp.json();
        const { url } = response;
        router.push(url);
      }}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold text-base transition-all hover:opacity-90 active:scale-[0.98] shadow-xl cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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
