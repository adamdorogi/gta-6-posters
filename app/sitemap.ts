import type { MetadataRoute } from "next";
import { site } from "./utils/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/privacy", "/terms"].map((path) => ({
    url: new URL(path, site.origin).href,
  }));
}
