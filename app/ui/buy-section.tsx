import Image from "next/image";
import { useState } from "react";
import BuyButton from "./buy-button";
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

export default function BuySection({
  selectedGeneration,
}: {
  selectedGeneration: Generation;
}) {
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [selectedSize, setSelectedSize] = useState<string>(
    Object.keys(products)[0],
  );

  return (
    <section className="flex flex-col items-center gap-8 w-full mx-auto bg-white py-8 md:py-10">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-black italic tracking-tight text-foreground leading-tight">
          Get Your Portrait Now
        </h2>
        <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
          No watermark • Instant download
        </p>
      </div>

      {/* Buy Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 px-4 md:px-0 w-full max-w-full md:max-w-[720px]">
        {/* Physical Canvas Section */}
        <div className="relative flex flex-col items-center gap-6 p-4 pt-8 rounded-2xl border border-border bg-background shadow-sm h-fit">
          <div className="absolute text-nowrap -top-3 left-1/2 -translate-x-1/2 px-5 py-1 bg-ring text-foreground text-base font-bold rounded-full">
            {sale.name} - {sale.discount}% OFF
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-serif font-black italic text-foreground">
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
            <p className="text-muted-foreground text-sm">
              Canvas delivered to your wall & instant digital download after
              purchase
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 justify-between items-center w-full">
              <span className="text-primary text-sm">Choose size:</span>
              <div className="flex self-end justify-center p-1 rounded-full bg-muted">
                <button
                  onClick={() => setUnit("in")}
                  className={`px-2 w-9 py-0.5 text-sm font-bold rounded-full transition-colors cursor-pointer ${
                    unit === "in"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  in
                </button>
                <button
                  onClick={() => setUnit("cm")}
                  className={`px-2 w-9 py-0.5 text-sm font-bold rounded-full transition-colors cursor-pointer ${
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
              {Object.keys(products)
                .filter((size) => size !== "Digital")
                .map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`relative flex flex-col items-center justify-center py-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSize === size
                        ? size === "Large"
                          ? "border-accent bg-accent/20 shadow-sm border-2"
                          : "border-primary bg-primary-accent shadow-sm border-2"
                        : "border-border bg-background"
                    }`}
                  >
                    {size === "Medium" && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full whitespace-nowrap">
                        Popular
                      </span>
                    )}
                    {size === "Large" && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-ring text-foreground text-[10px] font-bold rounded-full whitespace-nowrap">
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
              "12K Digital Download",
              "Satin Finish",
              "Pinewood Frame",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-base text-foreground"
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
          <BuyButton
            disabled={!selectedGeneration?.path}
            size={selectedSize}
            price={products[selectedSize].price}
            generationId={selectedGeneration.id}
            text="Canvas + Digital"
            iconPath="/box.svg"
            iconAlt="Buy Icon"
          />
        </div>

        {/* Digital Download Section */}
        <div className="relative flex flex-col items-center gap-6 p-4 pt-8 rounded-2xl border border-border bg-background shadow-sm h-fit">
          <div className="absolute text-nowrap -top-3 left-1/2 -translate-x-1/2 px-5 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
            Prefer digital only?
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-serif font-black italic text-foreground">
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
              "12K high-resolution digital file",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-base text-foreground"
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
          <BuyButton
            disabled={!selectedGeneration?.path}
            size="Digital"
            price={products["Digital"].price}
            generationId={selectedGeneration.id}
            text="Digital Only"
            iconPath="/download.svg"
            iconAlt="Download Icon"
          />
        </div>
      </div>

      {/* Payment Methods */}
      <div className="flex flex-col gap-3 items-center w-full">
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
            Safe checkout and 14-days money-back guarantee
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
