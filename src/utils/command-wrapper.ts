import * as util from "util";
import * as child_process from "child_process";
import fs from "fs";
import { log, spinner } from "@clack/prompts";

const execFile = util.promisify(child_process.execFile);

export async function mkdir(
  path: string,
  option?: { hideLog?: boolean }
): Promise<void> {
  const dirPath = await fs.promises.mkdir(path, { recursive: true });
  if (!option?.hideLog) {
    log.success(`Created "${dirPath}"`);
  }
}

export async function cd(
  path: string,
  option?: { hideLog?: boolean; createDirectoryIfNotExists?: boolean }
): Promise<void> {
  if (option?.createDirectoryIfNotExists && !fs.existsSync(path)) {
    log.info(`${path} doesn't exist`);
    await mkdir(path);
  }

  process.chdir(path);
  if (!option?.hideLog) {
    log.success(`Change directory: "${path}"`);
  }
}

export async function cp(
  from: string,
  to: string,
  option?: { hideLog?: boolean }
): Promise<void> {
  await fs.promises.cp(from, to, { recursive: true });
  if (!option?.hideLog) {
    log.success(`Created "${to}"`);
  }
}

export async function run(
  command: string,
  option?: {
    hideCommand?: boolean;
    hideStdout?: boolean;
    hideStderr?: boolean;
  }
): Promise<{ stdout: string; stderr: string }> {
  if (!option?.hideCommand) {
    log.info("$ " + command);
  }

  const [file, ...args] = command.split(" ");

  const { stdout, stderr } = await execFile(file, args);

  if (!option?.hideStdout && stdout) {
    log.success(stdout);
  }
  if (!option?.hideStderr && stderr) {
    log.error(stderr);
  }

  return { stdout, stderr };
}

export async function loading(
  taskName: string,
  command: string,
  option?: {
    hideCommand?: boolean;
    hideStdout?: boolean;
    hideStderr?: boolean;
  }
): Promise<void> {
  if (!option?.hideCommand) {
    log.info(command);
  }

  const s = spinner();
  s.start(`Begin: ${taskName}`);
  const { stdout, stderr } = await run(command, {
    hideCommand: true,
    hideStderr: true,
    hideStdout: true,
  });
  s.stop(`End: ${taskName}`);

  if (!option?.hideStdout && stdout) {
    log.success(stdout);
  }
  if (!option?.hideStderr && stderr) {
    log.error(stderr);
  }
}
