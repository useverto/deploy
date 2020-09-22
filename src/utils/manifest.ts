import { Route } from "../types";
import { readFileSync } from "fs";
import { join } from "path";

export default function createManifest(routes: Route[]): string {
  const template = JSON.parse(
    new TextDecoder().decode(
      readFileSync(join(__dirname, "../../assets/manifest-template.json"))
    )
  );

  let paths: Record<string, Record<string, string>> = {};

  for (const route of routes) {
    if (route.path !== "index.html" && route.path.includes("/index.html"))
      paths[route.path.replace("/index.html", "")] = {
        id: route.transactionID,
      };
    else paths[route.path] = { id: route.transactionID };
  }

  template.paths = paths;

  return JSON.stringify(template, null, 2);
}
