import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Turn Royal: Get Turned Into Royalty",
    short_name: "Turn Royal",
    description: "Customized Canvas Printing",
    start_url: "/",
    display: "standalone",
    background_color: "#392f5a",
    theme_color: "#392f5a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
