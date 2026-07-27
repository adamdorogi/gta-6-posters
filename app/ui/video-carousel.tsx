"use client";

import { useState, useRef, useEffect } from "react";

function VideoCarousel({ videoFiles }: { videoFiles: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  const SLIDE_WIDTH = 320;
  const total = videoFiles.length;

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (i === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  const prev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const next = () => setActiveIndex((i) => (i + 1) % total);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative flex items-center justify-center w-full mx-auto overflow-hidden">
        <button
          onClick={prev}
          aria-label="Previous video"
          className="absolute z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-white/80 text-primary transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
          style={{
            left: `calc(50% - ${SLIDE_WIDTH / 2}px - 48px)`,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="overflow-x-visible w-full">
          <div className="relative" style={{ height: SLIDE_WIDTH * (16 / 9) }}>
            {videoFiles.map((fileName, idx) => {
              const distance = Math.abs(idx - activeIndex);
              const maxDistance = Math.max(total - 1, 1);
              const normalizedDistance = distance / maxDistance;

              const scale = 1 - normalizedDistance;
              const opacity = Math.max(0, 1 - normalizedDistance * 4);
              const leftOffset = (idx - activeIndex) * SLIDE_WIDTH;

              return (
                <div
                  key={fileName}
                  className="absolute flex-none px-2 duration-300 ease-out"
                  style={{
                    left: `calc(50% + ${leftOffset}px)`,
                    transform: "translateX(-50%)",
                    width: `${SLIDE_WIDTH}px`,
                  }}
                >
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[idx] = el;
                    }}
                    playsInline
                    width={SLIDE_WIDTH}
                    height={SLIDE_WIDTH * (16 / 9)}
                    controls={idx === activeIndex}
                    controlsList="nodownload"
                    muted
                    autoPlay
                    className="w-full h-auto rounded-xl shadow-lg transition-all duration-300 cursor-pointer"
                    style={{
                      opacity,
                      transform: `scale(${scale})`,
                      transformOrigin: "center center",
                    }}
                    onEnded={next}
                    onClick={() => setActiveIndex(idx)}
                  >
                    <source src={`/videos/${fileName}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={next}
          aria-label="Next video"
          className="absolute z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-white/80 text-primary transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
          style={{
            left: `calc(50% + ${SLIDE_WIDTH / 2}px)`,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-2">
        {videoFiles.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to video ${idx + 1}`}
            className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
              idx === activeIndex ? "bg-primary w-6" : "bg-primary/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default VideoCarousel;
