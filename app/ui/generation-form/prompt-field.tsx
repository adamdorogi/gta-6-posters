"use client";

interface PromptFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PromptField({ value, onChange }: PromptFieldProps) {
  return (
    <input
      type="text"
      placeholder="Personalise - add a crown..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
    />
  );
}
