"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "next/image";

function PosterTrack({
  images,
  horizontal = false,
  reverse = false,
}: {
  images: string[];
  horizontal?: boolean;
  reverse?: boolean;
}) {
  return (
    <div
      className={
        "poster-motion__track" +
        (horizontal ? " poster-motion__track--horizontal" : "") +
        (reverse ? " poster-motion__track--reverse" : "")
      }
      style={
        { "--motion-duration": `${images.length * (horizontal ? 7 : 13)}s` } as CSSProperties
      }
    >
      {[...images, ...images].map((src, index) => (
        <div key={index} className="poster-motion__tile">
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes={horizontal ? "175px" : "(min-width: 1024px) 24vw, 200px"}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
    </div>
  );
}

export default function ShowcaseCarousel({
  images,
  layout = "vertical",
}: {
  images: string[];
  layout?: "vertical" | "horizontal";
}) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className={`poster-motion ${layout === "vertical" ? "poster-motion__columns" : ""}`}
      data-paused={paused}
    >
      {layout === "horizontal" ? (
        <PosterTrack images={images} horizontal />
      ) : (
        <>
          <PosterTrack images={images.filter((_, index) => index % 2 === 0)} />
          <PosterTrack images={images.filter((_, index) => index % 2 !== 0)} reverse />
        </>
      )}
      <button
        type="button"
        className="poster-motion__control"
        aria-label={paused ? "Play carousel" : "Pause carousel"}
        onClick={() => setPaused((current) => !current)}
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          {paused ? <path d="M5 3v10l8-5Z" /> : <path d="M4 3h3v10H4zm5 0h3v10H9z" />}
        </svg>
      </button>
    </div>
  );
}
