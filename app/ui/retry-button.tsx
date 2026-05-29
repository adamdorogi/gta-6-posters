"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RetryButton({
  generationGroupId,
  generations,
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

  const inProgress = generations.filter(
    (generation) => generation.status === "in_progress",
  );

  useEffect(() => {
    if (inProgress.length === 0) return;

    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/status", {
          method: "POST",
          body: JSON.stringify({
            generationIds: inProgress.map((g) => g.id),
          }),
        });

        const json = await res.json();
        console.log("Polling...", JSON.stringify(json));

        const shouldRefresh = json.status.some(
          (s: { id: string; status: string }) => s.status !== "in_progress",
        );

        if (shouldRefresh) {
          router.refresh();
          return;
        }
      } catch (err) {
        console.error(err);
      }

      if (!cancelled) {
        setTimeout(poll, 2000);
      }
    }

    poll();

    return () => {
      cancelled = true;
    };
  }, [router, inProgress]);

  return (
    <>
      <select value={styleId} onChange={(e) => setStyleId(e.target.value)}>
        {styles.map((style) => (
          <option key={style.id} value={style.id}>
            {style.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Optional prompt"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
      />
      <button
        onClick={async (e) => {
          const resp = await fetch("/api/retry", {
            method: "POST",
            body: JSON.stringify({ generationGroupId, styleId, userPrompt }),
          });
          const response = await resp.json();
          console.log(response);
          router.refresh();
        }}
      >
        Retry
      </button>
    </>
  );
}
