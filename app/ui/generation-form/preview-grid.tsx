"use client";

import Image from "next/image";

interface PreviewItem {
  preview: string;
  uploadId: string | null;
}

interface PreviewGridProps {
  items: PreviewItem[];
  onRemove: (index: number) => void;
  onAdd?: () => void;
}

export default function PreviewGrid({
  items,
  onRemove,
  onAdd,
}: PreviewGridProps) {
  return (
    <div className="grid h-16 grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group relative aspect-square rounded-lg overflow-hidden border border-border"
        >
          <Image
            src={item.preview}
            alt="Preview"
            fill
            unoptimized
            className="object-cover"
          />
          {item.uploadId ? (
            <button
              onClick={() => onRemove(idx)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={onAdd}
        className="relative aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-ring hover:text-ring transition-all"
      >
        <span className="text-2xl font-bold">+</span>
      </button>
    </div>
  );
}
