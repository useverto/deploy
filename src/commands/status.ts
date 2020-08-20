import client from "../utils/arweave";
import log from "../utils/logger";
import { LogType } from "../types";

export default async function command(id: string) {
  const { status } = await client.transactions.getStatus(id);

  switch (status) {
    case 400:
      log("Invalid transaction ID", LogType.error);
      break;
    
    case 500:
      log("Server error", LogType.error);
      break;
    
    case 200:
      log("Status: 200 success", LogType.success)
      break;
    
    default:
      log("Status: pending", LogType.warning);
  }
}