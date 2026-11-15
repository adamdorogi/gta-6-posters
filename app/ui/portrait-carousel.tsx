"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import type { PosterExample } from "@/app/utils/showcase";

function centerPortrait(scroller: HTMLDivElement, index: number, behavior: ScrollBehavior) {
  const slide = scroller.children.item(index) as HTMLElement | null;
  if (slide) {
    scroller.scrollTo({
      left: slide.offsetLeft - (scroller.clientWidth - slide.offsetWidth) / 2,
      behavior,
    });
  }
}

export default function PortraitCarousel({ posters }: { posters: PosterExample[] }) {
  const total = posters.length;
  const initialIndex = Math.floor(total / 2);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const viewport = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (viewport.current) centerPortrait(viewport.current, initialIndex, "instant");
  }, [initialIndex]);

  if (total === 0) return null;

  const goTo = (index: number) => {
    const scroller = viewport.current;
    if (!scroller) return;

    const targetIndex = (index + total) % total;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setActiveIndex(targetIndex);
    centerPortrait(scroller, targetIndex, reduceMotion ? "instant" : "smooth");
  };

  return (
    <div className="portrait-carousel">
      <div
        ref={viewport}
        className="portrait-carousel__viewport"
        onScroll={(event) => {
          const scroller = event.currentTarget;
          const first = scroller.children.item(0) as HTMLElement | null;
          const second = scroller.children.item(1) as HTMLElement | null;
          if (first && second) {
            const stride = second.offsetLeft - first.offsetLeft;
            setActiveIndex(Math.max(0, Math.min(total - 1, Math.round(scroller.scrollLeft / stride))));
          }
        }}
      >
        {posters.map(({ src, alt }, index) => (
          <button
            key={src}
            type="button"
            className="portrait-carousel__slide"
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => goTo(index)}
          >
            <Image
              alt={alt}
              src={src}
              fill
              sizes="(min-width: 768px) 376px, 76vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          aria-label="Previous poster"
          className="icon-button"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="m14 6-6 6 6 6" />
          </svg>
        </button>
        <div className="flex items-center">
          {posters.map(({ src }, index) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to poster ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className="carousel-dot"
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Next poster"
          className="icon-button"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="m10 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
