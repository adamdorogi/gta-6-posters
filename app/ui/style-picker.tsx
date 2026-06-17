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
      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all appearance-none cursor-pointer"
    >
      {styles.map((style) => (
        <option key={style.id} value={style.id}>
          {style.name}
        </option>
      ))}
    </select>
  );
}
