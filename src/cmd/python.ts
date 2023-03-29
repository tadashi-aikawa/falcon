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

type ProjectType = "python3-latest";

export async function exec() {
  intro(`Let's create a Python project!`);

  const projectName = await text({ message: "Project name?" });
  const projectType = (await select({
    message: "Python type?",
    options: [{ value: "python3-latest", label: "Python3 latest" }],
  })) satisfies ProjectType | symbol;

  if (isCancel(projectName) || isCancel(projectType)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  switch (projectType) {
    case "python3-latest":
      await createPython3Latest(projectName);
      break;
  }
}

async function createPython3Latest(projectName: string) {
  const projectType: ProjectType = "python3-latest";
  const projectRoot = path.join(BASE_PATH, "python", projectName);
  const templateRoot = path.join(FALCON_TEMPLATE_ROOT, "python");

  await cp(templateRoot, projectRoot);
  await cd(projectRoot, { createDirectoryIfNotExists: true });
  await loading(`Create virtual environment`, "python3 -m venv .venv");

  log.info("Run");
  const venvScripts = path.join(".venv", "Scripts");
  const python = path.join(venvScripts, "python");
  await run(`${python} main.py`);

  log.success("Success!");
  outro(`cd ${projectRoot}`);
}
