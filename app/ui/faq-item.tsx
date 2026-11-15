"use client";

import { useId, useState } from "react";

type FaqItemProps = {
  question: string;
  answers: string[];
};

export default function FaqItem({ question, answers }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const answerId = useId();

  return (
    <div className="border-t border-border">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-h-13 w-full cursor-pointer items-center justify-between gap-4 py-3 text-left hover:text-primary"
      >
        <span className="text-sm font-semibold leading-relaxed md:text-base">
          {question}
        </span>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-transform duration-200 ${
            isOpen ? "rotate-180 bg-primary-accent" : "rotate-0"
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
        id={answerId}
        aria-hidden={!isOpen}
        className={`grid overflow-hidden transition-[grid-template-rows,padding] duration-200 ease-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr] pb-0"
        }`}
      >
        <div className="min-h-0">
          {answers.map((answer, index) => (
            <p
              key={index}
              className="max-w-[70ch] py-1.5 text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              {answer}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
