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
    <select value={selectedStyleId} onChange={(e) => onChange(e.target.value)}>
      {styles.map((style) => (
        <option key={style.id} value={style.id}>
          {style.name}
        </option>
      ))}
    </select>
  );
}
