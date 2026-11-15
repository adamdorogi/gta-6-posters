"use client";

import { useId } from "react";
import Image from "next/image";
import { stylePreviews } from "@/app/utils/showcase";

type Style = {
  id: string;
  name: string;
};

export default function StylePicker({
  selectedStyleId,
  styles,
  onChange,
}: {
  selectedStyleId: string | undefined;
  onChange: (styleId: string) => void;
  styles: Style[];
}) {
  const groupName = useId();

  return (
    <fieldset className="min-w-0 w-full" aria-label="Choose a style">
      <legend className="mb-2.5 text-xs font-bold tracking-[0.11em] text-primary uppercase">
        Pick a style
      </legend>
      <div className="style-options">
        {styles.map((style) => {
          const name = style.name.toLowerCase();
          const preview = stylePreviews[name] || stylePreviews["cover art"];
          const position = preview === stylePreviews["cover art"] ? "object-top" : "object-[center_27%]";
          return (
            <label key={style.id} className="style-option">
              <input
                type="radio"
                className="sr-only"
                name={groupName}
                checked={style.id === selectedStyleId}
                onChange={() => onChange(style.id)}
              />
              <span className="style-option__image">
                <Image
                  src={preview}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 180px, 30vw"
                  className={`object-cover ${position}`}
                />
              </span>
              <span className="style-option__name">{style.name}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
