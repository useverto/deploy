import path from "path";
import log from "../utils/logger";
import { LogType, Route } from "../types";
import fs, { promises } from "fs";
import { lookup as lookupType } from "mime-types";
import client from "../utils/arweave";
import version from "../version";
import createManifest from "../utils/manifest";
import cliProgess, { SingleBar } from "cli-progress";
import ask from "../utils/ask";
import ReferenceFixer from "../utils/references";

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

  for(const fl of filesToDeploy) console.log(`\x1b[2m    ${ fl.replace(deployDir + "/", "") }    ${ fs.statSync(fl).size / 1000000.0 }MB\x1b[0m`);

  const confirmation = await ask("\x1b[33m\nAre you sure you want to deploy these files? (yes/no)  \x1b[0m");

  if(confirmation.toLowerCase() !== "yes" && confirmation.toLowerCase() !== "y") return log("Cancelled deployment!", LogType.error);

  log("Starting to deploy...\n\n");

  let progressBar = new SingleBar({ 
    barCompleteString: '\u2588',
    barIncompleteString: '\u2591',
    hideCursor: true,
    clearOnComplete: true,
    format (options, params, payload): string {
      const 
        completeSize = Math.round(params.progress * options.barsize),
        incompleteSize = options.barsize - completeSize;

      return "\x1b[2m" +
      payload.task +
      "\x1b[0m " +
      options.barCompleteString.substr(0, completeSize) + 
      options.barIncompleteString.substr(0, incompleteSize) +
      " | " +
      (params.progress * 100 < 25 ? "\x1b[2m\x1b[31m" : (params.progress * 100 < 50 ? "\x1b[31m" : (params.progress * 100 < 75 ? "\x1b[33m" : "\x1b[32m"))) +
      Math.round((params.progress * 100 + Number.EPSILON) * 100) / 100 +
      "\x1b[0m%" +
      " | ETA: " +
      params.eta + 
      "s | " + 
      params.value +
      "/" + 
      params.total +
      " files";
    }
  }, cliProgess.Presets.shades_classic);
  progressBar.start(filesToDeploy.length + 1, 0); // +1 is for the manifest
  
  for(const file of filesToDeploy) {

    progressBar.update({ task: file.replace(deployDir + "/", "") })

    let data = new TextDecoder().decode(await promises.readFile(file));
    const contentType = lookupType(file);

    // fixing references
    if(contentType === "text/html") {
      
      const
        level = file.replace(deployDir + "/", "").match(/\//g) !== null ? file.replace(deployDir + "/", "").match(/\//g).length - 1 : 0,
        referenceFixer = new ReferenceFixer(data, level);
        
      data = referenceFixer.getSrc();
    
    }

    let transaction = await client.createTransaction({ data }, keyfileContent);
    transaction.addTag("Content-Type", contentType ? contentType : "text/plain");
    transaction.addTag("User-Agent", `verto-deploy/${ version }`);

    await client.transactions.sign(transaction, keyfileContent);
    let uploader = await client.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
    }

    if(uploader.lastResponseStatus === 200) routesWithTransactionID.push({ path: file.replace(deployDir + "/", ""), transactionID: transaction.id });
    else log(uploader.lastResponseStatus.toString() + "   " + file.replace(deployDir + "/", ""), LogType.error);

    progressBar.increment();

  }

  progressBar.update({ task: "manifest.json" })

  let
    manifest = createManifest(routesWithTransactionID),
    manifestTransaction = await client.createTransaction({ data: manifest }, keyfileContent);

  manifestTransaction.addTag("Content-Type", "application/x.arweave-manifest+json");
  manifestTransaction.addTag("User-Agent", `verto-deploy/${ version }`);

  await client.transactions.sign(manifestTransaction, keyfileContent);
  let manifestUploader = await client.transactions.getUploader(manifestTransaction);

  while (!manifestUploader.isComplete) {
    await manifestUploader.uploadChunk();
  }

  progressBar.increment();
  progressBar.stop();

  if(manifestUploader.lastResponseStatus === 200) {

    log("\n\nDeployed to Arweave. Your site will be hosted on the URL below:", LogType.success);
    log(`${ "\x1b[36m" }https://arweave.net/${ manifestTransaction.id }`, LogType.log);
    log("You can check the status of this deployment by running " + "\x1b[1m" + `verto status ${ manifestTransaction.id }`, LogType.warning)

  }else log("There was an error uploading your site!", LogType.error)

}