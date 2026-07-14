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
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="mx-auto mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-ring px-6 py-4 text-lg font-bold text-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
    >
      {children}
    </button>
  );
}
