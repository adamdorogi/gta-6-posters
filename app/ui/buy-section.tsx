import Image from "next/image";
import { useState } from "react";
import BuyButton from "./buy-button";
import { formatPrice, printSizes, products, storeCurrency } from "@/app/utils/pricing";

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

const printFeatures = [
  "Smooth, glossy poster paper",
  "Unframed and ready to display",
  "High-resolution digital file included",
  "Standard shipping included to eligible destinations",
];

const digitalFeatures = ["No watermark", "High-resolution file", "Download link by email"];

function PlanFeatures({ items }: { items: string[] }) {
  return (
    <ul className="purchase-features">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <svg
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.25}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5 9-10" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function BuySection({
  selectedGeneration,
  position = "below",
}: {
  selectedGeneration: Generation;
  position?: "beside-artwork" | "below";
}) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [selectedSize, setSelectedSize] = useState<(typeof printSizes)[number]>("Medium");
  const selectedPrint = products[selectedSize];
  const printDimension = (mm: number) =>
    unit === "cm" ? mm / 10 : (mm / 25.4).toFixed(1);

  return (
    <section className={`purchase ${position === "below" ? "purchase--bottom site-container" : ""}`}>
      <div className="purchase__intro">
        <h2 className="section-title">Order your poster</h2>
        <p className="mt-2 text-sm text-muted-foreground">Your finished artwork without the preview watermark.</p>
      </div>

      <div className="purchase-plans">
        <div className="purchase-plan purchase-plan--print">
          <h3 className="purchase-plan__title">Poster + Digital Download</h3>
          <div>
            <div className="purchase-price">
              <span className="text-accent">{formatPrice(selectedPrint.price)}</span>
              <span className="text-sm text-muted-foreground">{storeCurrency}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A paper print for your wall and a digital copy sent to your inbox.
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">Choose a size</span>
              <div className="unit-switch" role="group" aria-label="Measurement units">
                {(["cm", "in"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={unit === value}
                    onClick={() => setUnit(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {printSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                  className="purchase-size"
                >
                  <span className="purchase-size__dimensions">{products[size].label}</span>
                  <span className="text-xs text-muted-foreground">{formatPrice(products[size].price)}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {printDimension(selectedPrint.widthMm)} × {printDimension(selectedPrint.heightMm)} {unit}
            </p>
          </div>

          <PlanFeatures items={printFeatures} />
          <BuyButton
            disabled={!selectedGeneration?.path}
            size={selectedSize}
            generationId={selectedGeneration.id}
            text="Poster + Digital"
            iconPath="/box.svg"
          />
        </div>

        <div className="purchase-plan">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 className="purchase-plan__title">Digital Download</h3>
            <span className="text-xs font-medium text-muted-foreground">Prefer digital only?</span>
          </div>
          <div>
            <div className="purchase-price">
              <span>{formatPrice(products.Digital.price)}</span>
              <span className="text-sm text-muted-foreground">{storeCurrency}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Save your artwork or print it yourself.</p>
          </div>
          <PlanFeatures items={digitalFeatures} />
          <BuyButton
            disabled={!selectedGeneration?.path}
            size="Digital"
            generationId={selectedGeneration.id}
            text="Digital Only"
            iconPath="/download.svg"
            appearance="secondary"
          />
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-5 flex w-full flex-col items-center gap-3">
        <div className="flex items-center gap-1.5">
          <svg
            className="w-4 h-4 text-accent flex-shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 13.41l-3-3L9.41 10 11 11.59 14.59 8 16 9.41l-5 5z"
            ></path>
          </svg>
          <span className="text-xs text-muted-foreground text-center">
            Secure checkout and a 14-day money-back guarantee
          </span>
        </div>
        <div className="flex items-center gap-[7.5px]">
          <div className="bg-[#f5f2ee] border border-[#4a4256] rounded-[6px] h-6 w-[34.5px] flex items-center justify-center">
            <Image
              src="/payment/mastercard.svg"
              alt="Mastercard"
              className="block"
              width={22.36}
              height={13.4}
            />
          </div>
          <div className="bg-[#f5f2ee] border border-[#4a4256] rounded-[6px] h-6 w-[34.5px] flex items-center justify-center">
            <Image
              src="/payment/visa.svg"
              alt="Visa"
              className="block"
              width={23.8}
              height={7.82}
            />
          </div>
          <div className="bg-[#f5f2ee] border border-[#4a4256] rounded-[6px] h-6 w-[34.5px] flex items-center justify-center">
            <Image
              src="/payment/apple-pay.svg"
              alt="Apple Pay"
              className="block"
              width={24.75}
              height={10.42}
            />
          </div>
          <div className="bg-[#f5f2ee] border border-[#4a4256] rounded-[4px] h-6 w-[34.5px] flex items-center justify-center gap-[1px]">
            <Image
              src="/payment/gpay-g.svg"
              alt=""
              className="block"
              width={8.04}
              height={8.32}
            />
            <Image
              src="/payment/gpay-pay.svg"
              alt="Google Pay"
              className="block"
              width={14.1}
              height={9.42}
            />
          </div>
          <div className="bg-[#f5f2ee] border border-[#4a4256] rounded-[4px] h-6 w-[33.75px] flex items-center justify-center">
            <Image
              src="/payment/paypal.svg"
              alt="PayPal"
              className="block"
              width={10.72}
              height={13.16}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
