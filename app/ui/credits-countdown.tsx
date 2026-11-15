"use client";

import { useEffect, useState } from "react";

interface CreditsCountdownProps {
  initialCredits: number;
  initialRemainingSeconds: number;
}

export default function CreditsCountdown({
  initialCredits,
  initialRemainingSeconds,
}: CreditsCountdownProps) {
  const [credits, setCredits] = useState(initialCredits);
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialRemainingSeconds,
  );

  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const timer = setTimeout(() => {
      if (remainingSeconds <= 1) {
        setRemainingSeconds(0);
        setCredits(5);
      } else {
        setRemainingSeconds((prev) => prev - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [remainingSeconds]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);

    return parts.join(" ");
  };

  return credits === 5 ? null : (
    <div className="flex flex-wrap items-center justify-end gap-x-1.5 rounded-full border border-border bg-surface px-2.5 py-1.5 text-[0.65rem] font-medium text-muted-foreground tabular-nums sm:px-3 sm:text-xs">
      <span className="whitespace-nowrap">
        <strong className="font-bold text-primary">{credits}</strong>
        {" "}
        {credits == 1 ? "credit" : "credits"} left
      </span>
      {remainingSeconds > 0 && credits < 5 && (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="size-1 rounded-full bg-primary opacity-80" />
          Resets in{" "}
          <strong className="font-bold text-primary">{formatTime(remainingSeconds)}</strong>
        </span>
      )}
    </div>
  );
}
