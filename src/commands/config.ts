import { Command } from "commander";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const envPath = () => resolve(process.cwd(), ".env");

const showCommand = new Command("show")
  .description("Show current configuration")
  .action(() => {
    const path = envPath();
    if (existsSync(path)) {
      console.log(readFileSync(path, "utf-8"));
    } else {
      console.log("No .env file found");
    }
  });

const initCommand = new Command("init")
  .description("Create a new .env file")
  .action(() => {
    const path = envPath();
    if (existsSync(path)) {
      console.log(".env already exists");
      return;
    }
    const template = `# Mini-Passy Configuration
# Add your API keys below:

# Provider URLs and Keys
PROVIDER_OPENAI_URL=https://api.openai.com
PROVIDER_OPENAI_KEY=sk-your-openai-key

PROVIDER_ANTHROPIC_URL=https://api.anthropic.com
PROVIDER_ANTHROPIC_KEY=sk-your-anthropic-key

# Port (default: 3333)
PORT=3333
`;
    writeFileSync(path, template);
    console.log("Created .env file. Edit it to add your API keys.");
  });

const setCommand = new Command("set")
  .description("Set a configuration value")
  .argument("<key>", "Configuration key")
  .argument("<value>", "Configuration value")
  .action((key: string, value: string) => {
    const path = envPath();
    let content = existsSync(path) ? readFileSync(path, "utf-8") : "";

    const regex = new RegExp(`^${key}=.*$`, "m");
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}`;
    }

    writeFileSync(path, content.trim() + "\n");
    console.log(`Set ${key}=${value}`);
  });

export const configCommand = new Command("config")
  .description("Manage Mini-Passy configuration")
  .addCommand(showCommand)
  .addCommand(initCommand)
  .addCommand(setCommand);
