import { readdir } from "node:fs/promises";
import path from "node:path";
import type { MetadataRoute } from "next";
import { siteUrl } from "./site";

const CONTENT_ROOT = path.join(process.cwd(), "public", "content");

async function findHtmlPaths(directory: string, relativePath = ""): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const childRelativePath = path.join(relativePath, entry.name);
      if (entry.isDirectory()) return findHtmlPaths(path.join(directory, entry.name), childRelativePath);
      return entry.isFile() && /\.html?$/i.test(entry.name) ? [childRelativePath] : [];
    }),
  );
  return paths.flat();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let documentPaths: string[] = [];
  try {
    documentPaths = await findHtmlPaths(CONTENT_ROOT);
  } catch {
    documentPaths = [];
  }

  return [
    { url: siteUrl.toString(), changeFrequency: "weekly", priority: 1 },
    ...documentPaths.map((documentPath) => ({
      url: new URL(`/content/${documentPath.split(path.sep).join("/")}`, siteUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
