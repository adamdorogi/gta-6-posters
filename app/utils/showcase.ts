import fs from "fs/promises";
import path from "path";

export async function getShowcaseImages() {
  const showcaseDir = path.join(process.cwd(), "public/showcase");
  try {
    const dirs = await fs.readdir(showcaseDir, { withFileTypes: true });
    const categories = dirs.filter((dirent) => dirent.isDirectory());

    const allImages: string[] = [];

    for (const category of categories) {
      const categoryPath = path.join(showcaseDir, category.name);
      const files = await fs.readdir(categoryPath);

      const images = files
        .filter(
          (file) =>
            file.endsWith(".webp") ||
            file.endsWith(".jpg") ||
            file.endsWith(".png"),
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      images.forEach((file) => {
        allImages.push(`/showcase/${category.name}/${file}`);
      });
    }

    return allImages.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error reading showcase directory:", error);
    return [];
  }
}
