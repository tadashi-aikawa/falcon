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
  await intro(`Let's create a TypeScript project!`);

  const projectName = await text({ message: "Project name?" });
  const projectType = (await select({
    message: "Project type?",
    options: [{ value: "node18", label: "node18", hint: "recommended" }],
  })) satisfies "node18" | symbol;

  if (isCancel(projectName) || isCancel(projectType)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

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

  await log.info("Build and run");
  await run("npm run dev");

  log.success("Success!");
  await outro(`cd ${projectRoot}`);
}
