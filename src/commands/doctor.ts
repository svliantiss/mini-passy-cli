import { Command } from "commander";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

export const doctorCommand = new Command("doctor")
  .description("Diagnose Mini-Passy setup issues")
  .action(async () => {
    let exitCode = 0;

    console.log("Mini-Passy Doctor\n");

    // Check Node version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);
    if (majorVersion >= 18) {
      console.log("✓ Node.js version:", nodeVersion);
    } else {
      console.log("✗ Node.js version:", nodeVersion, "(requires >= 18)");
      exitCode = 1;
    }

    // Check .env file
    const envPath = resolve(process.cwd(), ".env");
    if (existsSync(envPath)) {
      console.log("✓ .env file exists");

      // Check for API keys
      const envContent = readFileSync(envPath, "utf-8");
      const apiKeyPatterns = [
        "PROVIDER_OPENAI_KEY",
        "PROVIDER_ANTHROPIC_KEY",
        "PROVIDER_NEBIUS_KEY",
        "PROVIDER_DEEPINFRA_KEY",
      ];

      const foundKeys = apiKeyPatterns.filter((key) =>
        envContent.includes(`${key}=`) && !envContent.includes(`${key}=\n`)
      );
      if (foundKeys.length > 0) {
        console.log("✓ Found API keys:", foundKeys.join(", "));
      } else {
        console.log("✗ No API keys configured");
        console.log("  Add at least one provider API key to .env");
        exitCode = 1;
      }
    } else {
      console.log("✗ No .env file found");
      console.log("  Run: mini-passy config init");
      exitCode = 1;
    }

    // Check if gateway is running
    try {
      const response = await fetch("http://127.0.0.1:3333/v1/models", {
        signal: AbortSignal.timeout(1000),
      });
      if (response.ok) {
        console.log("✓ Gateway is running on port 3333");
      }
    } catch {
      console.log("⚠ Gateway not running (run: mini-passy start)");
    }

    process.exit(exitCode);
  });
