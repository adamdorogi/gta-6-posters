import type { MetadataRoute } from "next";
import { metadata } from "./layout";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: metadata.metadataBase!.toString(),
      lastModified: new Date(),
      priority: 1,
    },
  ];
}
