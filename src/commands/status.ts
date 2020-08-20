import client from "../utils/arweave";

export default async function command(id: string) {
  const { status } = await client.transactions.getStatus(id);

  switch (status) {
    case 400:
      console.log("Invalid transaction ID");
      break;
    
    case 500:
      console.log("Server error");
      break;
    
    case 200:
      console.log("Status: 200 success")
      break;
    
    default:
      console.log("Status: pending");
  }
}