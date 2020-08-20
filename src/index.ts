import sade from "sade";

import deployCommand from "./commands/deploy";
import statusCommand from "./commands/status";
import balanceCommand from "./commands/balance";

const prog = sade("verto");

prog
  .version("1.0.0")

prog
  .command("deploy")
  .describe("Deploy the given Sapper project on Arweave")
  .option("-d, --dir", "Deploy directory")
  .option("-k, --keyfile", "Link keyfile")
  .action(deployCommand)

prog
  .command("status <id>")
  .describe("Return the status of the given transaction from Arweave")
  .action(statusCommand)

prog
  .command("balance <keyfile>")
  .describe("Get Arweave balance for the given keyfile")
  .action(balanceCommand)

prog.parse(process.argv);