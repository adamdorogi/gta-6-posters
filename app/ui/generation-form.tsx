"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StylePicker from "./style-picker";
import UploadZone from "./generation-form/upload-zone";
import PreviewGrid from "./generation-form/preview-grid";
import PromptField from "./generation-form/prompt-field";

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

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadIds((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <StylePicker
        selectedStyleId={styleId}
        onChange={setStyleId}
        styles={styles}
      />

      <UploadZone onFilesSelected={handleFiles} clickable={files.length === 0}>
        {files.length > 0 ? (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PreviewGrid
              items={previews.map((preview, idx) => ({
                preview,
                uploadId: uploadIds[idx],
              }))}
              onRemove={removeFile}
              onAdd={() => document.getElementById("file-input")?.click()}
            />

            {uploadIds.some((id) => id !== null) && (
              <>
                <PromptField value={userPrompt} onChange={setUserPrompt} />

                <button
                  onClick={() => {
                    router.push(
                      `/generate?style=${styleId}&prompt=${encodeURIComponent(userPrompt)}&photos=${uploadIds.join(",")}`,
                    );
                  }}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all shadow-lg active:scale-[0.98]"
                >
                  Create my masterpiece
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <span className="text-lg">📸</span>
            <span>Drag a photo or click to upload</span>
          </>
        )}
      </UploadZone>
    </div>
  );
}
