"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StylePicker from "./style-picker";

export default function GenerationForm({
  styles,
}: {
  styles: { id: string; name: string }[];
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadIds, setUploadIds] = useState<(string | null)[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [styleId, setStyleId] = useState<string | undefined>(styles[0]?.id);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const router = useRouter();

  const handleFiles = async (newFilesArray: File[]) => {
    const newFiles = Array.from(newFilesArray);
    if (newFiles.length === 0) return;

    const startIndex = files.length;
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [
      ...prev,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ]);
    setUploadIds((prev) => [...prev, ...newFiles.map(() => null)]);

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const index = startIndex + i;
      const formData = new FormData();
      formData.append("photos", file);
      try {
        fetch("/api/upload", {
          method: "POST",
          body: formData,
        }).then(async (resp) => {
          const result = await resp.json();
          setUploadIds((prev) => {
            const next = [...prev];
            next[index] = result.uploadId;
            return next;
          });
        });
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    await handleFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadIds((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Choose a Style
        </label>
        <StylePicker
          selectedStyleId={styleId}
          onChange={setStyleId}
          styles={styles}
        />
      </div>

      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Upload Photos
        </label>
        <div
          className="flex flex-col items-center justify-center w-full"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <label
            htmlFor="file-input"
            className="flex h-32 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900 px-5 text-zinc-900 dark:text-zinc-100 font-medium cursor-pointer transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
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
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-3 gap-4">
            {previews.map((src, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800"
              >
                <Image src={src} alt="Preview" fill className="object-cover" />
                {!uploadIds[idx] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Prompt (Optional)
            </label>
            <input
              type="text"
              placeholder="Describe what you want to see..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all"
            />
          </div>

          <button
            onClick={() => {
              if (uploadIds.some((id) => id === null)) {
                alert("Please wait for all images to upload");
                return;
              }
              router.push(
                `/generate?style=${styleId}&prompt=${encodeURIComponent(userPrompt)}&photos=${uploadIds.join(",")}`,
              );
            }}
            className="w-full py-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-lg active:scale-[0.98]"
          >
            Create My Portrait
          </button>
        </div>
      )}
    </div>
  );
}
