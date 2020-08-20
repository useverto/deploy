import { LogType } from "../types";

export default function log (message: string, type: LogType = LogType.log) {
  console.log(
    "\x1b[2m" +
    "[" +
    "\x1b[0m" +
    "\x1b[35m" +
    "Verto" +
    "\x1b[0m" +
    "\x1b[2m" +
    "]" +
    "\x1b[0m",
    `${ type }${ message }\x1b[0m`
  );
}