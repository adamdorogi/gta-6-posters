"use client";

import Image from "next/image";
import React from "react";

interface PreviewItem {
  preview: string;
  uploadId: string | null;
}

interface PreviewGridProps {
  items: PreviewItem[];
  onRemove: (index: number) => void;
}

export default function PreviewGrid({ items, onRemove }: PreviewGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative aspect-square rounded-lg overflow-hidden border border-border"
        >
          <Image
            src={item.preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          {!item.uploadId && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <button
            onClick={() => onRemove(idx)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
