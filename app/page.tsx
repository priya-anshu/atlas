import { type Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { AtlasWorkspace, type Resource } from "./AtlasWorkspace";

const CONTENT_ROOT = path.join(process.cwd(), "public", "content");
const CATEGORIES = ["notes", "formulas", "pyq"] as const;

function toTitle(fileName: string) {
  return fileName
    .replace(/\.html?$/i, "")
    .replace(/^\d+[-_\s]*/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function numericPrefix(fileName: string) {
  return Number(fileName.match(/^(\d+)/)?.[1] ?? Number.MAX_SAFE_INTEGER);
}

async function findHtmlFiles(
  directory: string,
  resourceDetails: Omit<Resource, "id" | "title" | "path" | "relativePath" | "order">,
  relativePath = "",
): Promise<Resource[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const resources = await Promise.all(
    entries.map(async (entry) => {
      const childRelativePath = path.join(relativePath, entry.name);
      if (entry.isDirectory()) {
        return findHtmlFiles(path.join(directory, entry.name), resourceDetails, childRelativePath);
      }
      if (!entry.isFile() || !/\.html?$/i.test(entry.name)) return [];

      const normalizedPath = childRelativePath.split(path.sep).join("/");
      const publicPath = [resourceDetails.grade, resourceDetails.subject, resourceDetails.category, normalizedPath].join("/");
      return [
        {
          ...resourceDetails,
          id: publicPath,
          title: toTitle(entry.name),
          path: `/content/${publicPath}`,
          relativePath: normalizedPath,
          order: numericPrefix(entry.name),
        },
      ];
    }),
  );

  return resources.flat();
}

async function getResources(): Promise<Resource[]> {
  let gradeEntries: Dirent<string>[] = [];
  try {
    gradeEntries = await readdir(CONTENT_ROOT, { withFileTypes: true });
  } catch {
    return [];
  }

  const resourceGroups = await Promise.all(
    gradeEntries.filter((entry) => entry.isDirectory()).map(async (gradeEntry) => {
      const gradeDirectory = path.join(CONTENT_ROOT, gradeEntry.name);
      const subjectEntries = await readdir(gradeDirectory, { withFileTypes: true });

      return Promise.all(
        subjectEntries.filter((entry) => entry.isDirectory()).map(async (subjectEntry) => {
          const subjectDirectory = path.join(gradeDirectory, subjectEntry.name);
          const categoryGroups = await Promise.all(
            CATEGORIES.map(async (category) => {
              try {
                return await findHtmlFiles(path.join(subjectDirectory, category), {
                  grade: gradeEntry.name,
                  subject: subjectEntry.name,
                  category,
                });
              } catch {
                return [];
              }
            }),
          );
          return categoryGroups.flat();
        }),
      );
    }),
  );

  return resourceGroups
    .flat(2)
    .sort((first, second) => first.order - second.order || first.title.localeCompare(second.title));
}

export default async function Home() {
  return <AtlasWorkspace resources={await getResources()} />;
}
