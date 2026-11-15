"use client";

export default function ScrollToTopButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
      }}
      className="site-button"
    >
      {children}
    </button>
  );
}
