import type { MetadataRoute } from "next";
import { metadata } from "./layout";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${metadata.metadataBase}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${metadata.metadataBase}privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${metadata.metadataBase}terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
