#!/usr/bin/env node
import { log, select } from "@clack/prompts";
import * as typescript from "./cmd/typescript";
import * as python from "./cmd/python";
import * as go from "./cmd/go";

type CommandFunction = () => Promise<void>;

async function main() {
  const command = await select({
    message: "Select a language",
    options: [
      { value: "TypeScript", label: "TypeScript" },
      { value: "Python", label: "Python" },
      { value: "Go", label: "Go" },
      { value: "Coming soon...", label: "Coming soon..." },
    ],
  });

  try {
    switch (command) {
      case "TypeScript":
        await typescript.exec();
        break;
      case "Python":
        await python.exec();
        break;
      case "Go":
        await go.exec();
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
