import { mkdir, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../dist/client/", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("pages-export", `${Date.now()}`);

const { default: worker } = await import(workerUrl.href);
const { allLocalizedRoutes } = await import("../app/lib/i18n-routes.ts");

for (const route of allLocalizedRoutes()) {
  const response = await worker.fetch(
    new Request(route.path, {
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
    throw new Error(`Static export failed for ${route.path} with HTTP ${response.status}`);
  }

  const html = await response.text();
  if (!html.includes("Local AI Club") || !html.includes(route.marker)) {
    throw new Error(`Static export for ${route.path} did not contain the expected site content`);
  }

  const outputPath = new URL(route.output, outputDirectory);
  await mkdir(new URL(".", outputPath), { recursive: true });
  await writeFile(outputPath, html, "utf8");
}

const rootHtml = await import("node:fs/promises").then(({ readFile }) =>
  readFile(new URL("index.html", outputDirectory), "utf8"),
);

await Promise.all([
  writeFile(new URL("404.html", outputDirectory), rootHtml, "utf8"),
  writeFile(new URL(".nojekyll", outputDirectory), "", "utf8"),
]);

console.log(`Static Pages artifact exported to dist/client (${allLocalizedRoutes().length} routes)`);
