import sade from "sade";

import deployCommand from "./commands/deploy";
import statusCommand from "./commands/status";

const prog = sade("verto");

prog
  .version("1.0.0")

prog
  .command("deploy")
  .describe("Deploy the given Sapper project")
  .option("-d, --dir", "Deploy directory")
  .option("-k, --keyfile", "Link keyfile")
  .action(deployCommand)

prog
  .command("status <id>")
  .describe("Return the status of the given transaction from Arweave")
  .action(statusCommand)

prog.parse(process.argv);