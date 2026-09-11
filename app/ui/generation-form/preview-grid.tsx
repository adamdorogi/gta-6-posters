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
    <div className="flex -mx-4 gap-2 overflow-x-auto px-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group relative h-20 md:h-24 w-20 md:w-24 shrink-0 overflow-hidden rounded-lg"
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
              className="absolute top-1 right-1 bg-black/50 text-primary-foreground rounded-full w-5 h-5 text-[10px] flex items-center justify-center hover:bg-black/75 transition-all md:opacity-0 group-hover:opacity-100 cursor-pointer"
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
              <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ))}
      {items.length < 3 && (
        <button
          onClick={onAdd}
          className="flex items-center justify-center h-20 md:h-24 w-20 md:w-24 shrink-0 rounded-lg bg-primary-accent hover:bg-primary-accent/75 transition-all cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Image
              src="/add.svg"
              alt="Add Icon"
              width={24}
              height={24}
              priority
            />
          </div>
        </button>
      )}
    </div>
  );
}
