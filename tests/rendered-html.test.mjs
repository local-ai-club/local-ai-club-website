import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("renders Local AI Club product metadata and core entry points", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
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

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>Local AI Club 网站原型<\/title>/i);
  assert.match(html, /面向本地、端侧、边缘与私有化 AI 的开放技术社区/);
  assert.match(html, /我的设备能运行什么模型/);
  assert.match(html, /企业 Agent/);
});

test("exports a complete static Pages artifact", async () => {
  const html = await readFile(
    new URL("../dist/client/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /<title>Local AI Club 网站原型<\/title>/i);
  assert.match(html, /https:\/\/local-ai\.club\/og\.png/);
  assert.equal((html.match(/src="\/logo\.png"/g) ?? []).length, 3);
  await access(new URL("../dist/client/logo.png", import.meta.url));
  assert.match(html, /(?:href|src)="\/assets\//);
  assert.doesNotMatch(html, /\/local-ai-club-website\/assets\//);
  await access(new URL("../dist/client/.nojekyll", import.meta.url));
});
