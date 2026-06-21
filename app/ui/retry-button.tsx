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
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
          Style
        </label>
        <StylePicker
          selectedStyleId={styleId}
          onChange={setStyleId}
          styles={styles}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
          Prompt
        </label>
        <input
          type="text"
          placeholder="Describe what you want to see..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
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
        className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
      >
        Retry Generation
      </button>
    </div>
  );
}
