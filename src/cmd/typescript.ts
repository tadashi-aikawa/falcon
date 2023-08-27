import {
  cancel,
  intro,
  isCancel,
  log,
  outro,
  select,
  text,
} from "@clack/prompts";
import path from "path";
import * as os from "os";
import { cd, cp, loading, run } from "../utils/command-wrapper";

const BASE_PATH = path.join(os.homedir(), "tmp", "sandbox");
const FALCON_TEMPLATE_ROOT = path.join(__dirname, "..", "..", "template");

export async function exec() {
  intro(`Let's create a TypeScript project!`);

  const projectName = await text({ message: "Project name?" });
  const projectType = (await select({
    message: "Project type?",
    options: [
      { value: "node20", label: "Node 20" },
      { value: "node18", label: "Node 18" },
      { value: "node16", label: "Node 16" },
      { value: "vue-vite", label: "Vue + Vite" },
    ],
  })) satisfies "node20" | "node18" | "node16" | "vue-vite" | symbol;

  if (isCancel(projectName) || isCancel(projectType)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  switch (projectType) {
    case "node20":
      await createNode("20", projectName);
      break;
    case "node18":
      await createNode("18", projectName);
      break;
    case "node16":
      await createNode("16", projectName);
      break;
    case "vue-vite":
      await createVueVite(projectName);
      break;
  }
}

async function createNode(nodeVersion: string, projectName: string) {
  const projectType = `node${nodeVersion}`
  const projectRoot = path.join(BASE_PATH, "typescript", projectName);
  const templateRoot = path.join(FALCON_TEMPLATE_ROOT, "typescript");

  await cp(path.join(templateRoot, "node"), projectRoot);
  await cp(
    path.join(templateRoot, projectType, "tsconfig.json"),
    path.join(projectRoot, "tsconfig.json")
  );
  await cd(projectRoot);
  await loading(`Install typescript, prettier`, "npm i -D typescript prettier");
  await loading(`Install tsconfig`, `npm i -D @tsconfig/${projectType}`);
  await run("npm list");

  log.info("Pin node version");
  await run(`volta pin node@${nodeVersion}`);

  log.info("Build and run");
  await run("npm run dev");

  log.success("Success!");
  outro(`cd ${projectRoot}`);
}

async function createVueVite(projectName: string) {
  const projectRoot = path.join(BASE_PATH, "typescript", projectName);
  const projectParentRoot = path.join(BASE_PATH, "typescript");

  await cd(projectParentRoot, { createDirectoryIfNotExists: true });
  await run(`npm create vite@latest -y ${projectName} -- --template vue-ts`);

  await cd(projectRoot, { createDirectoryIfNotExists: true });
  await loading(`Install dependencies`, "npm i");
  await loading(`Install prettier`, "npm i -D prettier");
  await run("npm list");

  log.success("Success!");
  outro(`cd ${projectRoot}
npm run dev`);
}
