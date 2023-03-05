import { log, select } from "@clack/prompts";
import * as typescript from "./cmd/typescript";

type CommandFunction = () => Promise<void>;

async function main() {
  const command = await select({
    message: "Select a language",
    options: [
      { value: "TypeScript", label: "TypeScript" },
      { value: "Coming soon...", label: "Coming soon..." },
    ],
  });

  try {
    switch (command) {
      case "TypeScript":
        await typescript.exec();
        break;
      default:
        console.log("Do nothing...");
    }
  } catch (e: any) {
    log.error(e.message);
    process.exit(1);
  }
}

main();
