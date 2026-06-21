"use client";

import React from "react";

interface PromptFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PromptField({ value, onChange }: PromptFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-medium text-muted-foreground">
        Prompt (Optional)
      </label>
      <input
        type="text"
        placeholder="Describe what you want to see..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
      />
    </div>
  );
}
