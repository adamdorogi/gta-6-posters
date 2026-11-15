"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StylePicker from "./style-picker";
import PromptField from "./generation-form/prompt-field";
import Image from "next/image";
import { event as metaEvent } from "@/app/utils/meta-pixel-events";
import { event as tikTokEvent } from "@/app/utils/tiktok-pixel-events";

export default function RetryButton({
  generationGroupId,
  styles,
  styleIdProp,
  userPromptProp,
  onDone,
}: {
  generationGroupId: string;
  generations: { id: string; status: string }[];
  styles: { id: string; name: string }[];
  styleIdProp: string;
  userPromptProp: string;
  onDone: () => void;
}) {
  const router = useRouter();
  const [styleId, setStyleId] = useState<string>(styleIdProp);
  const [userPrompt, setUserPrompt] = useState<string>(userPromptProp);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 w-full">
      <StylePicker
        selectedStyleId={styleId}
        onChange={setStyleId}
        styles={styles}
      />
      <PromptField value={userPrompt} onChange={setUserPrompt} />
      {error && (
        <div className="text-center text-sm text-destructive">
          {error}
        </div>
      )}
      <button
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          setError(null);
          const metaEventId = crypto.randomUUID();
          const tikTokEventId = crypto.randomUUID();
          metaEvent("RetryPreview", null, { eventID: metaEventId });
          tikTokEvent("RetryPreview", null, { event_id: tikTokEventId });
          try {
            const resp = await fetch("/api/retry", {
              method: "POST",
              body: JSON.stringify({
                generationGroupId,
                styleId,
                userPrompt,
                metaEventId,
                tikTokEventId,
              }),
            });
            const response = await resp.json();
            if (!resp.ok) {
              throw new Error(response);
            }
            router.refresh();
            onDone();
          } catch (error) {
            console.error("Generation failed:", error);
            setError("Out of credits. Please try again later.");
            setIsLoading(false);
          }
        }}
        className="site-button w-full"
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
            Create Another Version
          </>
        )}
      </button>
    </div>
  );
}
