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
      className="upload-zone flex w-full flex-col items-center justify-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {clickable ? (
        <label
          htmlFor="file-input"
          className="upload-zone__target cursor-pointer"
        >
          <div className="flex w-full flex-col items-center gap-2">
            {children}
          </div>
        </label>
      ) : (
        <div className="upload-zone__target">
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
        className="sr-only"
        aria-label="Upload a photo"
        tabIndex={clickable ? 0 : -1}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadZone;
