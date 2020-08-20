import Arweave from "arweave";

const client = new Arweave({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false
});

export default client;