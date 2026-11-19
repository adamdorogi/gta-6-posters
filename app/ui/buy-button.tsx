"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { event as metaEvent } from "@/app/utils/meta-pixel-events";
import { event as tikTokEvent } from "@/app/utils/tiktok-pixel-events";
import { formatPrice, getProductDetails, type ProductSize, type StoreCurrency } from "@/app/utils/pricing";
import { site } from "@/app/utils/site";

export default function BuyButton({
  generationId,
  size,
  currency,
  text,
  iconPath,
  disabled = false,
  appearance = "primary",
}: {
  generationId: string;
  size: ProductSize;
  currency: StoreCurrency;
  text: string;
  iconPath: string;
  disabled?: boolean;
  appearance?: "primary" | "secondary";
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const product = getProductDetails(size, currency);

  async function openCheckout() {
    setError("");
    setIsLoading(true);
    try {
      const metaEventId = crypto.randomUUID();
      const tikTokEventId = crypto.randomUUID();
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId, size, currency, metaEventId, tikTokEventId }),
      });
      if (response.status === 409) {
        router.refresh();
        setError("Prices have been updated for your region. Please try again.");
        setIsLoading(false);
        return;
      }
      const { url } = await response.json();
      if (!response.ok || typeof url !== "string") {
        throw new Error("Checkout is unavailable.");
      }

      const eventData = {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        value: product.price / 100,
        currency,
        num_items: 1,
      };
      try {
        metaEvent("InitiateCheckout", eventData, { eventID: metaEventId });
        tikTokEvent("InitiateCheckout", {
          ...eventData,
          contents: [{
            content_id: product.id,
            content_name: product.name,
            content_type: "product",
            price: product.price / 100,
            quantity: 1,
            brand: site.name,
          }],
        }, { event_id: tikTokEventId });
      } catch (error) {
        console.warn("Checkout analytics unavailable.", error);
      }
      window.location.assign(url);
    } catch {
      setError("We couldn’t open checkout. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        onClick={openCheckout}
        className={`site-button w-full ${appearance === "secondary" ? "site-button--outline" : ""}`}
      >
        {isLoading ? (
          <span>Opening checkout…</span>
        ) : (
          <>
            <Image src={iconPath} alt="" width={20} height={20} />
            <span>{text}</span>
            <span aria-hidden="true" className="opacity-70">•</span>
            <span className="opacity-70">{formatPrice(product.price, currency)}</span>
          </>
        )}
      </button>
      {error && <p role="alert" className="text-sm text-primary">{error}</p>}
    </>
  );
}
