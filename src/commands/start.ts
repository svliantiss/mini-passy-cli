import { Command } from "commander";
import { spawn } from "child_process";
import { createRequire } from "module";

export const startCommand = new Command("start")
  .description("Start the gateway server")
  .option("-p, --port <port>", "Port to run on", "3333")
  .option("-d, --detach", "Run in background")
  .action((options) => {
    const require = createRequire(import.meta.url);
    const gatewayPath = require.resolve("@mini-passy/sdk/dist/index.js");

    const env = { ...process.env, PORT: options.port };

    if (options.detach) {
      const proc = spawn("node", [gatewayPath], {
        env,
        detached: true,
        stdio: "ignore",
      });
      proc.unref();
      console.log(`Gateway started in background (PID: ${proc.pid})`);
    } else {
      const proc = spawn("node", [gatewayPath], {
        env,
        stdio: "inherit",
      });
      proc.on("exit", (code) => process.exit(code || 0));
    }
  });
