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

// List aliases
const listCommand = new Command("list")
  .description("List configured aliases")
  .action(() => {
    const content = readEnv();
    const aliases: string[] = [];

    const regex = /ALIAS_(\w+)=(.+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const name = match[1].toLowerCase();
      const target = match[2];
      aliases.push(`${name.padEnd(20)} → ${target}`);
    }

    if (aliases.length === 0) {
      console.log("No aliases configured.");
      console.log("Aliases are auto-created from providers.");
      console.log("Or add manually: mini-passy alias add <name> <provider>/<model>");
      return;
    }

    console.log("Configured Aliases:");
    console.log("===================");
    aliases.forEach((a) => console.log(`  ${a}`));
  });

// Add alias
const addCommand = new Command("add")
  .description("Add a new alias")
  .argument("<name>", "Alias name (e.g., gpt4, claude)")
  .argument("<target>", "Target (format: provider/model)")
  .action((name: string, target: string) => {
    const upperName = name.toUpperCase();
    const key = `ALIAS_${upperName}`;

    let content = readEnv();
    const regex = new RegExp(`^${key}=.*$`, "m");
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${target}`);
    } else {
      content += `\n${key}=${target}`;
    }
    writeEnv(content);

    console.log(`✓ Added alias: ${name} → ${target}`);
    console.log("\nUse it in API calls:");
    console.log(`  curl ... -d '{"model": "${name}", ...}'`);
  });

// Remove alias
const removeCommand = new Command("remove")
  .description("Remove an alias")
  .argument("<name>", "Alias name")
  .action((name: string) => {
    const upperName = name.toUpperCase();
    const key = `ALIAS_${upperName}`;
    let content = readEnv();

    if (!content.includes(`${key}=`)) {
      console.log(`Alias '${name}' not found.`);
      return;
    }

    const regex = new RegExp(`^${key}=.*$`, "m");
    content = content.replace(regex, "");
    writeEnv(content.replace(/\n+/g, "\n"));

    console.log(`✓ Removed alias: ${name}`);
  });

export const aliasCommand = new Command("alias")
  .description("Manage model aliases")
  .addCommand(listCommand)
  .addCommand(addCommand)
  .addCommand(removeCommand);
