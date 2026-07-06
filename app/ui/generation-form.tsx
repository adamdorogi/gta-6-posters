"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StylePicker from "./style-picker";
import UploadZone from "./generation-form/upload-zone";
import PreviewGrid from "./generation-form/preview-grid";
import PromptField from "./generation-form/prompt-field";
import Image from "next/image";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    <div className="px-12 flex min-w-0 flex-col gap-8 w-full">
      <StylePicker
        selectedStyleId={styleId}
        onChange={setStyleId}
        styles={styles}
      />

      <UploadZone onFilesSelected={handleFiles} clickable={files.length === 0}>
        {files.length > 0 ? (
          <div className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
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

                {error && (
                  <div className="text-destructive text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300">
                    {error}
                  </div>
                )}

                <button
                  disabled={isLoading}
                  onClick={async () => {
                    setIsLoading(true);
                    setError(null);
                    try {
                      const resp = await fetch("/api/generate", {
                        method: "POST",
                        body: JSON.stringify({
                          uploadIds,
                          styleId,
                          userPrompt,
                        }),
                      });
                      const response = await resp.json();
                      console.log(response);
                      if (!resp.ok) {
                        throw new Error(response);
                      }
                      const generationGroupId = response.generationGroupId;
                      router.push(`/preview/${generationGroupId}`);
                    } catch (error) {
                      console.error("Generation failed:", error);
                      setError("Out of credits. Please try again later.");
                      setIsLoading(false);
                    }
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all shadow-lg active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <>
                      <Image
                        src="/sparkle.svg"
                        alt="Sparkle Icon"
                        width={24}
                        height={24}
                        priority
                      />
                      Create my masterpiece
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-border text-primary">
                <Image
                  src="/upload.svg"
                  alt="Upload Icon"
                  width={24}
                  height={24}
                  priority
                />
              </div>
              <span className="font-bold">Drag a photo or click to upload</span>
            </div>
          </>
        )}
      </UploadZone>
    </div>
  );
}
