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
    <div className="flex -mx-4 gap-4 overflow-x-auto px-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border"
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
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center hover:bg-black/75 transition-all opacity-0 group-hover:opacity-100"
            >
              <Image
                src="/cross.svg"
                alt="Remove Icon"
                width={12}
                height={12}
                priority
              />
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
        className="flex items-center justify-center h-24 w-24 shrink-0 rounded-lg bg-border/50 hover:bg-border/75 transition-all cursor-pointer"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-border text-primary">
          <Image
            src="/add.svg"
            alt="Add Icon"
            width={24}
            height={24}
            priority
          />
        </div>
      </button>
    </div>
  );
}
