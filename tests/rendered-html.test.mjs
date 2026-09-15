import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function fetchHtml(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request(`http://localhost${path}`, {
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

  return response.text();
}

test("renders Chinese homepage metadata and core entry points", async () => {
  const html = await fetchHtml("/");
  assert.match(html, /<title>Local AI Club<\/title>/i);
  assert.match(html, /面向本地、端侧、边缘与私有化 AI 的开放技术社区/);
  assert.match(html, /我的设备能运行什么模型/);
  assert.match(html, /企业 Agent/);
  assert.match(html, /hrefLang="en" href="https:\/\/local-ai\.club\/en"/);
});

test("renders English homepage at /en", async () => {
  const html = await fetchHtml("/en");
  assert.match(html, /<title>Local AI Club<\/title>/i);
  assert.match(html, /An open technical community for local, on-device, edge and private AI/);
  assert.match(html, /What models can my device run/);
  assert.match(html, /Run AI<br\/?><em>on your own device<\/em>/);
  assert.match(html, /hrefLang="zh-CN" href="https:\/\/local-ai\.club\/"/);
});

test("renders localized section routes", async () => {
  const learn = await fetchHtml("/learn");
  assert.match(learn, /<title>学习 · Local AI Club<\/title>/i);
  assert.match(learn, /从第一次运行，到构建完整的本地 AI/);
  assert.match(learn, /KNOWLEDGE PATHS/);
  assert.match(learn, /href="\/learn\/run-first-local-model"/);
  assert.match(learn, /阅读全文/);
  assert.match(learn, /href="\/community\/article-contribution-guide"/);
  assert.doesNotMatch(learn, /Ollama、llama\.cpp 与 LM Studio 应该怎样选择/);
  assert.doesNotMatch(learn, /构建完全离线的个人文档知识库/);
  assert.match(learn, /hrefLang="en" href="https:\/\/local-ai\.club\/en\/learn"/);

  const enLearn = await fetchHtml("/en/learn");
  assert.match(enLearn, /href="\/en\/learn\/run-first-local-model"/);
  assert.match(enLearn, /Read article/);
  assert.match(enLearn, /href="\/en\/community\/article-contribution-guide"/);

  const agents = await fetchHtml("/en/agents");
  assert.match(agents, /<title>Enterprise Agents · Local AI Club<\/title>/i);
  assert.match(agents, /Enterprise agents that truly run on local AI/);
  assert.match(agents, /ENTERPRISE AGENTS/);
  assert.match(agents, /hrefLang="zh-CN" href="https:\/\/local-ai\.club\/agents"/);
});

test("renders a Velite article in both languages", async () => {
  const zh = await fetchHtml("/learn/run-first-local-model");
  assert.match(zh, /<title>在一台普通电脑上运行第一个本地模型 · Local AI Club<\/title>/i);
  assert.match(zh, /从设备检查、模型选择到完成第一次对话/);
  assert.match(zh, /ollama --version/);
  assert.match(zh, /class="article-code" data-lang="bash"/);
  assert.match(zh, />复制<\/button>/);
  assert.match(zh, /hrefLang="en" href="https:\/\/local-ai\.club\/en\/learn\/run-first-local-model"/);

  const en = await fetchHtml("/en/learn/run-first-local-model");
  assert.match(en, /<title>Run your first local model on an ordinary computer · Local AI Club<\/title>/i);
  assert.match(en, /From checking your device and choosing a model/);
  assert.match(en, /class="article-code" data-lang="bash"/);
  assert.match(en, />Copy<\/button>/);
  assert.match(en, /hrefLang="zh-CN" href="https:\/\/local-ai\.club\/learn\/run-first-local-model"/);
});

test("renders the article contribution guide in both languages", async () => {
  const zh = await fetchHtml("/community/article-contribution-guide");
  assert.match(zh, /<title>怎样给 Local AI Club 写一篇文章 · Local AI Club<\/title>/i);
  assert.match(zh, /用一对 Markdown 文件提交中英双语文章/);
  assert.match(zh, /content\/articles\/\{section\}\/\{slug\}\/index\.zh\.md/);
  assert.match(zh, /hrefLang="en" href="https:\/\/local-ai\.club\/en\/community\/article-contribution-guide"/);

  const en = await fetchHtml("/en/community/article-contribution-guide");
  assert.match(en, /<title>How to contribute an article to Local AI Club · Local AI Club<\/title>/i);
  assert.match(en, /Submit bilingual articles as a Markdown pair/);
  assert.match(en, /hrefLang="zh-CN" href="https:\/\/local-ai\.club\/community\/article-contribution-guide"/);
});

test("exports a complete static Pages artifact", async () => {
  const html = await readFile(
    new URL("../dist/client/index.html", import.meta.url),
    "utf8",
  );
  const enHtml = await readFile(
    new URL("../dist/client/en/index.html", import.meta.url),
    "utf8",
  );
  const learnHtml = await readFile(
    new URL("../dist/client/learn/index.html", import.meta.url),
    "utf8",
  );
  const enAgentsHtml = await readFile(
    new URL("../dist/client/en/agents/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /<title>Local AI Club<\/title>/i);
  assert.match(html, /https:\/\/local-ai\.club\/og\.png/);
  assert.match(enHtml, /What models can my device run/);
  assert.match(learnHtml, /从第一次运行，到构建完整的本地 AI/);
  assert.match(learnHtml, /href="\/learn\/run-first-local-model"/);
  assert.match(enAgentsHtml, /Enterprise agents that truly run on local AI/);
  assert.equal((html.match(/src="\/logo\.png"/g) ?? []).length, 3);
  await access(new URL("../dist/client/logo.png", import.meta.url));
  assert.match(html, /(?:href|src)="\/assets\//);
  assert.doesNotMatch(html, /\/local-ai-club-website\/assets\//);
  await access(new URL("../dist/client/.nojekyll", import.meta.url));
  await access(new URL("../dist/client/learn/run-first-local-model/index.html", import.meta.url));
  await access(new URL("../dist/client/en/learn/run-first-local-model/index.html", import.meta.url));
  await access(new URL("../dist/client/community/article-contribution-guide/index.html", import.meta.url));
  await access(new URL("../dist/client/en/community/article-contribution-guide/index.html", import.meta.url));
});
