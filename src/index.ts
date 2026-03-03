#!/usr/bin/env node
import { Command } from "commander";
import { startCommand } from "./commands/start.js";
import { modelsCommand } from "./commands/models.js";
import { configCommand } from "./commands/config.js";
import { doctorCommand } from "./commands/doctor.js";
import { providerCommand } from "./commands/provider.js";
import { aliasCommand } from "./commands/alias.js";

const program = new Command();

program
  .name("mini-passy")
  .description("CLI for Mini-Passy AI Gateway")
  .version("0.2.0");

program.addCommand(startCommand);
program.addCommand(modelsCommand);
program.addCommand(configCommand);
program.addCommand(doctorCommand);
program.addCommand(providerCommand);
program.addCommand(aliasCommand);

// Default: run start
if (process.argv.length === 2) {
  process.argv.push("start");
}

program.parse();
