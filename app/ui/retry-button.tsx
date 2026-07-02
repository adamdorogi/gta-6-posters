"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StylePicker from "./style-picker";
import PromptField from "./generation-form/prompt-field";
import Image from "next/image";

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
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="-m-4 -mt-8">
        <StylePicker
          selectedStyleId={styleId}
          onChange={setStyleId}
          styles={styles}
        />
      </div>
      <PromptField value={userPrompt} onChange={setUserPrompt} />
      <button
        onClick={async () => {
          setIsLoading(true);
          try {
            const resp = await fetch("/api/retry", {
              method: "POST",
              body: JSON.stringify({ generationGroupId, styleId, userPrompt }),
            });
            const response = await resp.json();
            console.log(response);
            router.refresh();
          } catch (error) {
            console.error("Generation failed:", error);
            setIsLoading(false);
          }
        }}
        className="inline-flex w-full items-center justify-center gap-2 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all shadow-lg active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            <Image
              src="/sparkle.svg"
              alt="Sparkle Icon"
              width={24}
              height={24}
              priority
            />
            Create new version
          </>
        )}
      </button>
    </div>
  );
}
