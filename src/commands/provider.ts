import { Command } from "commander";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const envPath = () => resolve(process.cwd(), ".env");

function readEnv(): string {
  const path = envPath();
  return existsSync(path) ? readFileSync(path, "utf-8") : "";
}

function writeEnv(content: string): void {
  writeFileSync(envPath(), content.trim() + "\n");
}

function setEnvVar(key: string, value: string): void {
  let content = readEnv();
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    content += `\n${key}=${value}`;
  }
  writeEnv(content);
}

function removeEnvVar(key: string): void {
  let content = readEnv();
  const regex = new RegExp(`^${key}=.*$`, "m");
  content = content.replace(regex, "");
  writeEnv(content.replace(/\n+/g, "\n"));
}

// List providers
const listCommand = new Command("list")
  .description("List configured providers")
  .action(() => {
    const content = readEnv();
    const providers: string[] = [];

    const regex = /PROVIDER_(\w+)_URL=(.+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const name = match[1].toLowerCase();
      const url = match[2];
      const keyVar = `PROVIDER_${match[1]}_KEY`;
      const hasKey = new RegExp(`^${keyVar}=.+`, "m").test(content);
      providers.push(`${name.padEnd(12)} ${url} ${hasKey ? "🔑" : ""}`);
    }

    if (providers.length === 0) {
      console.log("No providers configured.");
      console.log("Run: mini-passy provider add <name> --url <url>");
      return;
    }

    console.log("Configured Providers:");
    console.log("====================");
    providers.forEach((p) => console.log(`  ${p}`));
  });

// Add provider
const addCommand = new Command("add")
  .description("Add a new provider")
  .argument("<name>", "Provider name (e.g., ollama, emby)")
  .requiredOption("--url <url>", "Provider URL")
  .option("--key <key>", "API key (optional)")
  .action((name: string, options: { url: string; key?: string }) => {
    const upperName = name.toUpperCase();

    setEnvVar(`PROVIDER_${upperName}_URL`, options.url);
    if (options.key) {
      setEnvVar(`PROVIDER_${upperName}_KEY`, options.key);
    }

    console.log(`✓ Added provider: ${name}`);
    console.log(`  URL: ${options.url}`);
    if (options.key) {
      console.log(`  Key: ${options.key.slice(0, 8)}...`);
    }
    console.log("\nRestart the gateway to use this provider:");
    console.log("  mini-passy restart");
  });

// Remove provider
const removeCommand = new Command("remove")
  .description("Remove a provider")
  .argument("<name>", "Provider name")
  .action((name: string) => {
    const upperName = name.toUpperCase();
    const content = readEnv();

    if (!content.includes(`PROVIDER_${upperName}_URL`)) {
      console.log(`Provider '${name}' not found.`);
      return;
    }

    removeEnvVar(`PROVIDER_${upperName}_URL`);
    removeEnvVar(`PROVIDER_${upperName}_KEY`);

    console.log(`✓ Removed provider: ${name}`);
    console.log("\nRestart the gateway:");
    console.log("  mini-passy restart");
  });

export const providerCommand = new Command("provider")
  .description("Manage LLM providers")
  .addCommand(listCommand)
  .addCommand(addCommand)
  .addCommand(removeCommand);
