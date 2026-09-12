import type { MetadataRoute } from "next";
import { metadata } from "./layout";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Turn Royal: Turn Your Pet Into Royalty",
    short_name: "Turn Royal",
    description: metadata.description!,
    start_url: "/",
    display: "standalone",
    background_color: "#392f5a",
    theme_color: "#392f5a",
    icons: [
      {
        src: "/icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: "/icon-mask.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  };
}
