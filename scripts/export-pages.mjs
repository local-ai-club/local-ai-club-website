import { mkdir, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../dist/client/", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("pages-export", `${Date.now()}`);

const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("https://local-ai.club/", {
    headers: { accept: "text/html" },
  }),
  {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  },
  {
    waitUntil() {},
    passThroughOnException() {},
  },
);

if (!response.ok) {
  throw new Error(`Static export failed with HTTP ${response.status}`);
}

const html = await response.text();
if (!html.includes("Local AI Club")) {
  throw new Error("Static export did not contain the expected site content");
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(new URL("index.html", outputDirectory), html, "utf8"),
  writeFile(new URL("404.html", outputDirectory), html, "utf8"),
  writeFile(new URL(".nojekyll", outputDirectory), "", "utf8"),
]);

console.log("Static Pages artifact exported to dist/client");
