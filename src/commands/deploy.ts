import path from "path";
import log from "../utils/logger";
import { LogType } from "../types";
import fs, { promises } from "fs";

export default async function command({ dir, keyfile }: Record<string, string>) {
  
  if(dir === undefined || keyfile === undefined) return log("Insufficient options!", LogType.error);

  const 
    deployDir = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir),
    keyfileLocation = path.isAbsolute(keyfile) ? keyfile : path.join(process.cwd(), keyfile);

  if(!fs.existsSync(deployDir) || !fs.existsSync(keyfileLocation)) return log("Keyfile or deploy directory does not exist!", LogType.error);
  if(!fs.lstatSync(deployDir).isDirectory()) return log("Given deploy directory path is not a directory!", LogType.error);
  if(!fs.lstatSync(keyfileLocation).isFile()) return log("Given keyfile location does not point to a file!", LogType.error);
  if(!keyfileLocation.match(/(\.json)$/)) return log("Given keyfile is not a JSON!", LogType.error);

  

}