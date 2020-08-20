import path from "path";
import log from "../utils/logger";
import { LogType, Route } from "../types";
import fs, { promises } from "fs";
import { lookup as lookupType } from "mime-types";
import client from "../utils/arweave";
import version from "../version";

export default async function command({ dir, keyfile }: Record<string, string>) {
  
  if(dir === undefined || keyfile === undefined) return log("Insufficient options!", LogType.error);

  const 
    deployDir = path.isAbsolute(dir) ? dir.replace(/(\/)$/, "") : path.join(process.cwd(), dir).replace(/(\/)$/, ""),
    keyfileLocation = path.isAbsolute(keyfile) ? keyfile : path.join(process.cwd(), keyfile);

  if(!fs.existsSync(deployDir) || !fs.existsSync(keyfileLocation)) return log("Keyfile or deploy directory does not exist!", LogType.error);
  if(!fs.lstatSync(deployDir).isDirectory()) return log("Given deploy directory path is not a directory!", LogType.error);
  if(!fs.lstatSync(keyfileLocation).isFile()) return log("Given keyfile location does not point to a file!", LogType.error);
  if(!keyfileLocation.match(/(\.json)$/)) return log("Given keyfile is not a JSON!", LogType.error);

  let 
    filesToDeploy: string[] = [],
    routesWithTransactionID: Route[] = [];

  const 
    keyfileContent = JSON.parse(new TextDecoder().decode(await promises.readFile(keyfileLocation))),
    mapFiles = (analyizeDir: string) => {
      for(const element of fs.readdirSync(analyizeDir)) {
        if(fs.lstatSync(analyizeDir + "/" + element).isDirectory()) mapFiles(analyizeDir + "/" + element);
        else if(fs.lstatSync(analyizeDir + "/" + element).isFile()) filesToDeploy.push(analyizeDir + "/" + element);
      }
    };

  mapFiles(deployDir);
  
  for(const file of filesToDeploy) {

    const
      data = new TextDecoder().decode(await promises.readFile(file)),
      contentType = lookupType(file);

    let transaction = await client.createTransaction({ data }, keyfileContent);
    transaction.addTag("Content-Type", contentType ? contentType : "text/plain");
    transaction.addTag("User-Agent", `verto-deploy/${ version }`);

    await client.transactions.sign(transaction, keyfileContent);
    let uploader = await client.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }

    log(uploader.lastResponseStatus.toString() + "   " + file)
    routesWithTransactionID.push({ path: file, transactionID: transaction.id })

  }

  console.log(routesWithTransactionID);

}