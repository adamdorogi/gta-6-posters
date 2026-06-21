import fs from "fs/promises";
import path from "path";

export async function getShowcaseImages() {
  const showcaseDir = path.join(process.cwd(), "public/showcase");
  try {
    const files = await fs.readdir(showcaseDir);
    return files
      .filter(
        (file) =>
          file.endsWith(".webp") ||
          file.endsWith(".jpg") ||
          file.endsWith(".png"),
      )
      .map((file) => `/showcase/${file}`);
  } catch (error) {
    console.error("Error reading showcase directory:", error);
    return [];
  }
}
