export type PosterExample = { src: string; alt: string };

const coverPreview = "/showcase/cover/11aa5d53-6c0a-458b-b3d9-441adc940d43.jpeg";
const characterPreview = "/showcase/character/b73efb5f-5d1f-4b05-89a4-23ba527723af.jpeg";
const albumPreview = "/showcase/album/195bec6c-912f-4297-89db-9a3ae0ccac52.jpeg";

export const stylePreviews: Readonly<Record<string, string>> = {
  "cover art": coverPreview,
  character: characterPreview,
  "the album": albumPreview,
};

export const showcaseExamples: PosterExample[] = [
  { src: coverPreview, alt: "Cover Art poster showing a couple, a helicopter, and a speedboat in comic panels" },
  { src: characterPreview, alt: "Character poster of three friends around a turquoise car at sunset" },
  { src: albumPreview, alt: "The Album poster of a couple leaning against a car on a palm-lined street" },
  { src: "/showcase/cover/9803c321-c970-4a2b-ae58-861e1daccc88.jpeg", alt: "Cover Art collage featuring a couple, a motorcycle, and a yellow sports car" },
  { src: "/showcase/character/6ff75eea-ebb8-4630-a6b5-b9f2da2db2c3.jpeg", alt: "Character poster of a couple walking past pastel buildings under palm trees" },
  { src: "/showcase/album/577c7d70-fa2a-45a9-a2b0-f00037cc0ea5.jpeg", alt: "The Album poster of a couple next to a dark car under a pink sunset" },
  { src: "/showcase/cover/a8faf8ef-46f5-4b48-b976-60b74ecf609b.jpeg", alt: "Cover Art collage of illustrated characters and vehicles in pink and teal" },
  { src: "/showcase/character/02c19102-48f0-4e79-9c1c-fa37cb8f0f70.jpeg", alt: "Character poster of three friends beside a car on a coastal city street" },
  { src: "/showcase/album/71ad4a1c-a516-4a17-ba5e-28c7c5ed0b20.jpeg", alt: "The Album poster of three friends leaning on a car against a violet skyline" },
  { src: "/showcase/cover/3b668f49-8f94-416a-a2ae-8a3cbb16d420.jpeg", alt: "Cover Art collage featuring illustrated characters, a jet ski, and downtown buildings" },
  { src: "/showcase/character/bf468608-57a2-44b3-9d31-e9c8948152b5.jpeg", alt: "Character poster of two friends standing by a purple sports car at dusk" },
  { src: "/showcase/album/7d1af309-97b9-4564-b378-355e288a41ff.jpeg", alt: "The Album poster of a couple at a neon sunset with palm trees and a sports car" },
  { src: "/showcase/cover/64573dc2-2913-45f5-8896-2743437ac4d9.jpeg", alt: "Cover Art poster featuring illustrated characters, a helicopter, and a yellow car" },
  { src: "/showcase/character/ec8fd6f7-bdda-4653-b038-4212625ee1d6.jpeg", alt: "Character poster of a couple in teal and pink on a palm-lined city street" },
  { src: "/showcase/album/a02b2dcb-2e6d-43f8-a872-69ca78b93aa9.jpeg", alt: "The Album poster of three people around a car under a coral and violet sky" },
];

export const heroPosters = showcaseExamples.slice(0, 5).map(({ src }) => src);
