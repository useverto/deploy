export enum LogType {
  log = "\x1b[0m",
  error = "\x1b[31m",
  warning = "\x1b[33m",
  success = "\x1b[32m"
}

export interface Route {
  path: string
  transactionID: string
}