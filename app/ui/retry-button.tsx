"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StylePicker from "./style-picker";

export default function RetryButton({
  generationGroupId,
  styles,
  styleIdProp,
  userPromptProp,
}: {
  generationGroupId: string;
  generations: { id: string; status: string }[];
  styles: { id: string; name: string }[];
  styleIdProp: string;
  userPromptProp: string;
}) {
  const router = useRouter();
  const [styleId, setStyleId] = useState<string>(styleIdProp);
  const [userPrompt, setUserPrompt] = useState<string>(userPromptProp);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">
          Style
        </label>
        <StylePicker
          selectedStyleId={styleId}
          onChange={setStyleId}
          styles={styles}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">
          Prompt
        </label>
        <input
          type="text"
          placeholder="Describe what you want to see..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all"
        />
      </div>
      <button
        onClick={async () => {
          const resp = await fetch("/api/retry", {
            method: "POST",
            body: JSON.stringify({ generationGroupId, styleId, userPrompt }),
          });
          const response = await resp.json();
          console.log(response);
          router.refresh();
        }}
        className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-white px-5 text-white dark:text-black font-semibold transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.98]"
      >
        Retry Generation
      </button>
    </div>
  );
}
