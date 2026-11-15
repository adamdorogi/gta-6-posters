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
        placeholder="Add a detail, like a sunset or outfit…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-input px-4 py-3 pr-24 text-base text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 flex h-7 -translate-y-1/2 items-center rounded-full bg-primary-accent px-3 text-xs leading-none text-muted-foreground">
        Optional
      </span>
    </div>
  );
}
