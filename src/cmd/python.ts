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

type ProjectType = "python3-latest" | "python3.10" | "python3.9" | "python3.8";

export async function exec() {
  intro(`Let's create a Python project!`);

  const projectName = await text({ message: "Project name?" });
  const projectType = (await select({
    message: "Python type?",
    options: [
      { value: "python3-latest", label: "Python3 latest" },
      { value: "python3.10", label: "Python3.10" },
      { value: "python3.9", label: "Python3.9" },
      { value: "python3.8", label: "Python3.8" },
    ],
  })) satisfies ProjectType | symbol;

  if (isCancel(projectName) || isCancel(projectType)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  switch (projectType) {
    case "python3-latest":
      await createPython3(projectName, "python3");
      break;
    case "python3.10":
      await createPython3(projectName, "python310");
      break;
    case "python3.9":
      await createPython3(projectName, "python39");
      break;
    case "python3.8":
      await createPython3(projectName, "python38");
      break;
  }
}

async function createPython3(projectName: string, pythonCommand: string) {
  const projectRoot = path.join(BASE_PATH, "python", projectName);
  const templateRoot = path.join(FALCON_TEMPLATE_ROOT, "python");

  await cp(templateRoot, projectRoot);
  await cd(projectRoot, { createDirectoryIfNotExists: true });
  await loading(`Create virtual environment`, `${pythonCommand} -m venv .venv`);
  const venvScripts = path.join(".venv", "Scripts");

  const pip = path.join(venvScripts, "pip");
  await loading(`Install dependencies`, `${pip} install -r requirements.txt`);

  log.info("Run");
  const python = path.join(venvScripts, "python");
  await run(`${python} main.py`);

  log.success("Success!");
  outro(`cd ${projectRoot}`);
  outro(`.venv/Scripts/activate`);
}
