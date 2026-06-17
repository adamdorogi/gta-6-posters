"use client";

export default function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
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

        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Order Confirmed!
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Your high-resolution image is ready. You can now download it without
          watermarks.
        </p>

        <button
          onClick={onClose}
          className="w-full h-12 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.98]"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
