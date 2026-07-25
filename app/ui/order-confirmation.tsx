"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(true);

  const success = searchParams.has("success");

  if (!success || !isVisible) {
    return null;
  }

  return (
    <section className="w-full bg-background md:px-6 md:pt-6">
      <div className="mx-auto w-full max-w-4xl md:rounded-3xl border border-emerald-400 bg-emerald-200 p-5 sm:p-6">
        <div className="relative flex flex-col gap-5">
          <button
            type="button"
            aria-label="Dismiss order confirmation banner"
            onClick={() => setIsVisible(false)}
            className="absolute right-0 top-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-300 p-0 text-emerald-600 transition-colors hover:bg-emerald-400 hover:text-emerald-700 cursor-pointer"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
            >
              <path d="M3.5 3.5 12.5 12.5" />
              <path d="M12.5 3.5 3.5 12.5" />
            </svg>
          </button>

          <div className="flex items-center justify-start gap-4 pr-10 sm:pr-12">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-xl font-black text-white">
              <svg
                className="w-6 h-6 text-emerald-600"
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
            </div>
            <h2 className="text-2xl font-serif italic font-black tracking-tight text-emerald-950 sm:text-3xl">
              Thank you for your order!
            </h2>
          </div>

          <div className="grid gap-3 text-sm text-emerald-950/75 sm:grid-cols-2">
            <div className="flex h-full flex-col rounded-2xl border border-emerald-300 bg-emerald-100 px-4 py-3">
              <p className="font-semibold text-emerald-950">
                What happens next
              </p>
              <p className="mt-1 leading-5 text-emerald-950/70">
                We&apos;ll email your order details and digital download link
                shortly.
              </p>
            </div>
            <div className="flex h-full flex-col rounded-2xl border border-emerald-300 bg-emerald-100 px-4 py-3">
              <p className="font-semibold text-emerald-950">Need help?</p>
              <p className="mt-1 leading-5 text-emerald-950/70">
                Reply to your confirmation email if anything looks off, or email
                us at{" "}
                <Link
                  href="mailto:hello@turnroyal.com"
                  className="font-medium text-emerald-950/80 hover:underline"
                >
                  hello@turnroyal.com
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
