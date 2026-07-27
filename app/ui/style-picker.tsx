"use client";

import Image from "next/image";

type Style = {
  id: string;
  name: string;
};

const SHOWCASE_PREVIEWS: Record<string, string> = {
  royal: "/showcase/royal/Sample royal portrait of a woman.webp",
  cowboy: "/showcase/cowboy/Sample cowboy portrait of a girl.webp",
  mafiaBoss: "/showcase/mafia-boss/Sample mafia boss portrait of a couple.webp",
  superhero: "/showcase/superhero/Sample superhero portrait of a family.webp",
  viking: "/showcase/viking/Sample viking portrait of a father and son.webp",
};

function getPreviewSrc(style: Style) {
  const normalized =
    `${style.id} ${style.name.replace(/\s/g, "")}`.toLowerCase();

  for (const key of Object.keys(SHOWCASE_PREVIEWS)) {
    if (normalized.includes(key.toLowerCase())) {
      return SHOWCASE_PREVIEWS[key];
    }
  }

  return SHOWCASE_PREVIEWS.royal;
}

export default function StylePicker({
  selectedStyleId,
  styles,
  onChange,
}: {
  selectedStyleId: string | undefined;
  onChange: (styleId: string) => void;
  styles: Style[];
}) {
  return (
    <div className="min-w-0 w-full rounded-2xl bg-background">
      <div className="ml-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 pt-3">
        Pick a style
      </div>
      <div
        className="flex min-w-0 max-w-full gap-3 overflow-x-auto px-4 py-4"
        role="radiogroup"
        aria-label="Choose a style"
      >
        {styles.map((style) => {
          const selected = style.id === selectedStyleId;
          const previewSrc = getPreviewSrc(style);

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange(style.id)}
              aria-pressed={selected}
              className={`group cursor-pointer relative w-[108px] shrink-0 overflow-hidden rounded-xl text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${selected ? "scale-[1.03] ring-2 ring-accent ring-offset-2 ring-offset-background" : "border border-transparent"}`}
            >
              <div
                className={`relative aspect-[3/4] overflow-hidden rounded-xl`}
              >
                <Image
                  src={previewSrc}
                  alt={`${style.name} style preview`}
                  fill
                  sizes="172px"
                  className={`object-cover transition-transform duration-500 ${selected ? "scale-[1.04]" : "group-hover:scale-105"}`}
                  priority
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <p
                      className={`truncate text-base font-semibold text-pretty ${selected ? "text-accent font-bold" : "text-primary-foreground/90"}`}
                    >
                      {style.name}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
