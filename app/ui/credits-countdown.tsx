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

  return (
    <div className="flex opacity-80 items-center gap-1 px-3 py-1 rounded-full bg-primary-accent text-primary text-xs font-medium">
      <span className="font-bold">{credits}</span>
      <span className="opacity-80">
        {" "}
        {credits == 1 ? "credit" : "credits"} left
      </span>
      {remainingSeconds > 0 && credits < 5 && (
        <>
          <span className="w-1 h-1 rounded-full bg-primary opacity-80" />
          <span className="opacity-80">Resets in </span>
          <span className="text-primary font-bold">
            {formatTime(remainingSeconds)}
          </span>
        </>
      )}
    </div>
  );
}
