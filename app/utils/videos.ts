import { readdir } from "node:fs/promises";
import path from "node:path";

export async function getVideoFiles() {
  const videosDir = path.join(process.cwd(), "public", "videos");
  return (await readdir(videosDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.mp4$/i.test(entry.name))
    .map((entry) => path.parse(entry.name).name)
    .sort((a, b) => a.localeCompare(b));
}
