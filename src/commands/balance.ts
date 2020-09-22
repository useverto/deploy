import path from "path";
import log from "../utils/logger";
import { LogType } from "../types";
import fs, { promises } from "fs";
import client from "../utils/arweave";

export default async function command(keyfile: string) {
  const keyfileLocation = path.isAbsolute(keyfile)
    ? keyfile
    : path.join(process.cwd(), keyfile);

  if (!fs.lstatSync(keyfileLocation).isFile())
    return log(
      "Given keyfile location does not point to a file!",
      LogType.error
    );
  if (!keyfileLocation.match(/(\.json)$/))
    return log("Given keyfile is not a JSON!", LogType.error);

  const keyfileContent = JSON.parse(
      new TextDecoder().decode(await promises.readFile(keyfileLocation))
    ),
    address = await client.wallets.jwkToAddress(keyfileContent),
    balance = client.ar.winstonToAr(await client.wallets.getBalance(address));

  log(
    "\x1b[1m" +
      balance +
      "\x1b[2m" +
      "\x1b[0m" +
      "AR" +
      "\x1b[0m" +
      " on " +
      "\x1b[1m" +
      address
  );
}
