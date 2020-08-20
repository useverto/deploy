import { Route } from "../types";
import template from "../assets/manifest-template.json";

export default function createManifest (routes: Route[]): string {

  let paths: Record<string, Record<string, string>> = {};

  for(const route of routes) {
    if(route.path !== "index.html" && route.path.includes("/index.html")) paths[route.path.replace("/index.html", "")] = { id: route.transactionID };
    else paths[route.path] = { id: route.transactionID };
  }

  template.paths = paths;

  return JSON.stringify(template, null, 2);
  
}