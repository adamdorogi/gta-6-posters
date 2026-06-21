"use client";

export default function StylePicker({
  selectedStyleId,
  styles,
  onChange,
}: {
  selectedStyleId: string | undefined;
  onChange: (styleId: string) => void;
  styles: { id: string; name: string }[];
}) {
  return (
    <select
      value={selectedStyleId}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none cursor-pointer"
    >
      {styles.map((style) => (
        <option key={style.id} value={style.id}>
          {style.name}
        </option>
      ))}
    </select>
  );
}
