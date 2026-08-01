"use client";

import { useState } from "react";

type FaqItemProps = {
  question: string;
  answers: string[];
};

export default function FaqItem({ question, answers }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl bg-primary-foreground mt-2">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left cursor-pointer"
      >
        <span className="text-base font-bold text-foreground text-base">
          {question}
        </span>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 ${
            isOpen ? "rotate-180 bg-accent-dark" : "rotate-0 bg-accent"
          }`}
          aria-hidden="true"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      <div
        className={`grid overflow-hidden px-4 transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr] pb-0"
        }`}
      >
        <div className="min-h-0">
          <div className="h-px bg-muted" />

          {answers.map((answer, index) => (
            <p
              key={index}
              className="pt-5 text-base leading-relaxed text-foreground text-base"
            >
              {answer}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
