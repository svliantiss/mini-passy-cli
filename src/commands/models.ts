import { Command } from "commander";

export const modelsCommand = new Command("models")
  .description("List available models and aliases")
  .option("-j, --json", "Output as JSON")
  .option("-p, --port <port>", "Gateway port", "3333")
  .action(async (options: { json?: boolean; port: string }) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:${options.port}/v1/models`
      );
      const data = (await response.json()) as {
        data: Array<{ id: string }>;
      };

      if (options.json) {
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log("Available Models:");
        console.log("=================");
        data.data.forEach((model) => {
          console.log(`  ${model.id}`);
        });
      }
    } catch {
      console.error("Error: Gateway not running. Start with: mini-passy start");
      process.exit(1);
    }
  });
