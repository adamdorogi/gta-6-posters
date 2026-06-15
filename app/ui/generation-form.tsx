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
  const [uploadIds, setUploadIds] = useState<string[]>([]);
  const [styleId, setStyleId] = useState<string | undefined>(styles[0]?.id);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const router = useRouter();

  return (
    <>
      <StylePicker
        selectedStyleId={styleId}
        onChange={setStyleId}
        styles={styles}
      />
      <input
        type="text"
        placeholder="Optional prompt"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
      />
      <label
        htmlFor="file-input"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
      >
        Select Files
      </label>
      <input
        id="file-input"
        type="file"
        style={{ display: "none" }}
        multiple={true}
        onChange={async (e) => {
          if (!e.target.files || e.target.files.length === 0) return;
          const files = Array.from(e.target.files);
          setFiles((prev) => [...prev, ...files]);
          for (let i = 0; i < e.target.files.length; i++) {
            const formData = new FormData();
            formData.append("photos", e.target.files[i]);
            fetch("/api/upload", {
              method: "POST",
              body: formData,
            }).then(async (resp) => {
              const result = await resp.json();
              setUploadIds((prev) => [...prev, result.uploadId]);
            });
          }
        }}
      />
      <ul>
        {files.map((file, index) => (
          <Image
            src={URL.createObjectURL(file)}
            alt={file.name}
            width={100}
            height={100}
            key={index}
            unoptimized
          />
        ))}
      </ul>

      <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
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
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
        >
          Generate
        </button>
      </div>
    </>
  );
}
