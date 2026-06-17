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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const newFiles = Array.from(e.target.files);

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
    e.target.value = "";
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

      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Upload Photos
        </label>
        <div className="flex flex-col items-center justify-center w-full">
          <label
            htmlFor="file-input"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 px-5 text-zinc-900 dark:text-zinc-100 font-medium cursor-pointer transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 border-2 border-dashed border-zinc-300 dark:border-zinc-700"
          >
            <span>Select Files</span>
          </label>
          <input
            id="file-input"
            type="file"
            className="hidden"
            multiple={true}
            onChange={handleFileChange}
          />
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800"
              >
                <Image
                  src={previews[index]}
                  alt={file.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {!uploadIds[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {uploadIds[index] && (
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={async () => {
            const resp = await fetch("/api/generate", {
              method: "POST",
              body: JSON.stringify({
                uploadIds,
                styleId,
                userPrompt,
              }),
            });
            const response = await resp.json();
            const generationGroupId = response.generationGroupId;
            router.push(`/preview/${generationGroupId}`);
          }}
          disabled={!uploadIds.some((id) => id !== null)}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Magic
        </button>
      </div>
    </div>
  );
}
