"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { site } from "../utils/site";

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(true);

  const success = searchParams.has("success");

  if (!success || !isVisible) {
    return null;
  }

  return (
    <section className="w-full bg-background px-4 pt-5">
      <div className="mx-auto w-full max-w-4xl rounded-xl border border-emerald-700 bg-[#162b2b] p-5 sm:p-6">
        <div className="relative flex flex-col gap-5">
          <button
            type="button"
            aria-label="Dismiss order confirmation banner"
            onClick={() => setIsVisible(false)}
            className="absolute right-0 top-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-950 p-0 text-emerald-200 transition-colors hover:bg-emerald-900 cursor-pointer"
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-xl font-black text-white">
              <svg
                className="w-6 h-6 text-emerald-200"
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
            <h2 className="font-display text-3xl font-black text-emerald-100 uppercase sm:text-4xl">
              Thank you for your order!
            </h2>
          </div>

          <div className="grid gap-3 text-sm text-emerald-100 sm:grid-cols-2">
            <div className="flex h-full flex-col rounded-lg border border-emerald-800 bg-emerald-950/35 px-4 py-3">
              <p className="font-semibold text-emerald-100">
                What happens next
              </p>
              <p className="mt-1 leading-5 text-emerald-100/80">
                We&apos;ll email your order details and digital download link
                shortly.
              </p>
            </div>
            <div className="flex h-full flex-col rounded-lg border border-emerald-800 bg-emerald-950/35 px-4 py-3">
              <p className="font-semibold text-emerald-100">Need help?</p>
              <p className="mt-1 leading-5 text-emerald-100/80">
                Reply to your confirmation email if anything looks off, or email
                us at{" "}
                <Link
                  href={`mailto:${site.email}`}
                  className="font-medium text-emerald-100 hover:underline"
                >
                  {site.email}
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
