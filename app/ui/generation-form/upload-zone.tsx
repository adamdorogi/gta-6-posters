"use client";

import React from "react";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
}

export default function UploadZone({ onFilesSelected }: UploadZoneProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    onFilesSelected(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFilesSelected(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <label
        htmlFor="file-input"
        className="flex h-32 w-full items-center justify-center gap-2 rounded-2xl bg-muted px-5 text-foreground font-medium cursor-pointer transition-all hover:opacity-80 border-2 border-dashed border-border hover:border-ring"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg">📸</span>
          <span>Click to upload or drag and drop</span>
        </div>
      </label>
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
