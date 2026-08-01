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
        placeholder="Personalise — add a crown…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 pr-24 rounded-xl border border-border bg-white text-base md:text-sm text-foreground focus:outline-none focus:border-primary transition-all"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 flex h-7 -translate-y-1/2 items-center rounded-full bg-primary-accent/75 px-3 text-xs leading-none text-primary/75">
        Optional
      </span>
    </div>
  );
}
