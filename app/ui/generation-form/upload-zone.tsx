"use client";

import React from "react";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  children?: React.ReactNode;
  clickable?: boolean;
}

const UploadZone = ({
  onFilesSelected,
  children,
  clickable = true,
}: UploadZoneProps) => {
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
      {clickable ? (
        <label
          htmlFor="file-input"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-muted p-4 text-foreground font-medium transition-all border-3 border-dashed border-border cursor-pointer"
        >
          <div className="flex w-full flex-col items-center gap-2">
            {children}
          </div>
        </label>
      ) : (
        <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-muted p-4 text-foreground font-medium transition-all border-3 border-dashed border-border">
          <div className="flex w-full flex-col items-center gap-2">
            {children}
          </div>
        </div>
      )}
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
};

export default UploadZone;
