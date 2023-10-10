import { fileURLToPath } from "node:url";
import path from "node:path";

const __filenme = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filenme);

const ROOT = path.resolve(__dirname, "../..");

export function generateGithubLink(file: string) {
  const githubPath = path.relative(ROOT, file);

  return new URL(
    githubPath,
    "https://github.com/dfidalg0/blog/blob/main/",
  ).href;
}
