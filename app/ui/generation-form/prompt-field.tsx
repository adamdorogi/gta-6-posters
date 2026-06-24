"use client";

interface PromptFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PromptField({ value, onChange }: PromptFieldProps) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Personalise - add a crown..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 pr-24 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 flex h-7 -translate-y-1/2 items-center rounded-full border border-border bg-background px-3 text-xs font-semibold leading-none text-muted-foreground shadow-sm">
        Optional
      </span>
    </div>
  );
}
