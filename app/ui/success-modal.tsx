"use client";

export default function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background rounded-3xl p-8 w-full max-w-md shadow-2xl border border-border animate-in zoom-in-95 duration-200 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-2">
          Order Confirmed!
        </h3>
        <p className="text-muted-foreground mb-8">
          Your high-resolution image is ready. You can now download it without
          watermarks.
        </p>

        <button
          onClick={onClose}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
