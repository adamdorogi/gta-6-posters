"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StylePicker from "./style-picker";
import UploadZone from "./generation-form/upload-zone";
import PreviewGrid from "./generation-form/preview-grid";
import PromptField from "./generation-form/prompt-field";
import Image from "next/image";
import { event as metaEvent } from "@/app/utils/meta-pixel-events";
import { event as tikTokEvent } from "@/app/utils/tiktok-pixel-events";

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
          metaEvent("UploadPhoto", null, { eventID: result.metaEventId });
          tikTokEvent("UploadPhoto", null, { event_id: result.tikTokEventId });
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
    <div className="flex w-full min-w-0 flex-col gap-4 md:gap-5">
      <StylePicker
        selectedStyleId={styleId}
        onChange={setStyleId}
        styles={styles}
      />

      <UploadZone onFilesSelected={handleFiles} clickable={files.length === 0}>
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-4">
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
                  <div className="text-center text-sm text-destructive">
                    {error}
                  </div>
                )}

                <button
                  disabled={isLoading}
                  onClick={async () => {
                    if (previews.length > 3) {
                      setError("You can only upload up to 3 photos.");
                      return;
                    }
                    setIsLoading(true);
                    setError(null);
                    const metaEventId = crypto.randomUUID();
                    const tikTokEventId = crypto.randomUUID();
                    metaEvent("GeneratePreview", null, {
                      eventID: metaEventId,
                    });
                    tikTokEvent("GeneratePreview", null, {
                      event_id: tikTokEventId,
                    });
                    try {
                      const resp = await fetch("/api/generate", {
                        method: "POST",
                        body: JSON.stringify({
                          uploadIds,
                          styleId,
                          userPrompt,
                          metaEventId,
                          tikTokEventId,
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
                  className="site-button w-full"
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
                      Create My Poster
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3 text-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                <Image
                  src="/upload.svg"
                  alt="Upload Icon"
                  width={19}
                  height={19}
                  className="brightness-0"
                />
              </div>
              <span className="hidden md:inline font-bold">
                Drop a photo or click to upload
              </span>
              <span className="font-bold md:hidden">Tap to upload a photo</span>
            </div>
          </>
        )}
      </UploadZone>
    </div>
  );
}
