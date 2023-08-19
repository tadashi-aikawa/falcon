import { cancel, intro, isCancel, log, outro, text } from "@clack/prompts";
import path from "path";
import * as os from "os";
import { cd, cp, run } from "../utils/command-wrapper";

const BASE_PATH = path.join(os.homedir(), "tmp", "sandbox");
const FALCON_TEMPLATE_ROOT = path.join(__dirname, "..", "..", "template");

export async function exec() {
  intro(`Let's create a Go project!`);

  const projectName = await text({ message: "Project name? (kebab-case) " });

  if (isCancel(projectName)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  await createGo(projectName);
}

async function createGo(projectName: string) {
  const projectRoot = path.join(BASE_PATH, "go", projectName);
  const templateRoot = path.join(FALCON_TEMPLATE_ROOT, "go");

  await cp(templateRoot, projectRoot);
  await cd(projectRoot, { createDirectoryIfNotExists: true });
  await run(`go mod init example/${projectName}`);

  log.info("Run");
  await run(`go run .`);

  log.success("Success!");
  outro(`cd ${projectRoot}`);
}
