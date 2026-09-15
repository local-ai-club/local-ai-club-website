---
title: 怎样给 Local AI Club 写一篇文章
summary: 用一对 Markdown 文件提交中英双语文章：路径、frontmatter 和正文必须对齐，不要编造无法核实的内容。
tags:
  - 入门
  - 贡献指南
difficulty: beginner
readTime: 8
author: Local AI Club
publishedAt: 2026-09-15
updatedAt: 2026-09-15
reproStatus: pending
version: "0.1"
license: CC-BY-4.0
status: published
---

Local AI Club 的文章存在 Git 里，构建时编译成静态页面。中文是站点默认语言，英文在 `/en`。一次有效投稿必须同时交出两种语言，并且两边说的是同一件事。

这篇指南只覆盖**网站文章**。它不开放聊天群、活动报名或其他尚未公开的渠道。

## 文章放在哪里

文件必须成对出现，共用栏目和 slug：

```text
content/articles/{section}/{slug}/index.zh.md
content/articles/{section}/{slug}/index.en.md
```

规则只有三条：

1. `{section}` 只能是 `learn`、`benchmarks`、`projects`、`agents`、`bounties`、`community`。
2. `{slug}` 用英文 kebab-case，两种语言必须相同。
3. 不要把语言写进目录名或 slug。语言只来自文件名。

这篇指南自己的路径就是例子：

```text
content/articles/community/article-contribution-guide/index.zh.md
content/articles/community/article-contribution-guide/index.en.md
```

可以对照已发布的入门文 [在一台普通电脑上运行第一个本地模型](/learn/run-first-local-model)。

## 哪些字段要翻译

下面这些字段两边必须同值，**不要翻译**：

- `difficulty`、`readTime`、`author`、`publishedAt`、`updatedAt`
- `reproStatus`、`version`、`license`、`status`
- `environment.os`、`environment.engine`

下面这些必须翻译，且意思对齐：

- `title`、`summary`、`tags`
- `environment.model`（如果写了）

`tags` 条数要一样。中文用「入门 / 进阶 / 高级」等，英文用对应的 `Beginner` / `Intermediate` / `Advanced`。`status` 必须成对：一边 `published`，另一边不能是 `draft`。稿子没齐时，两边都先写 `draft`。只有两边都是 `published`，文章才会出现在栏目列表和静态路由里。

最小 frontmatter 可以长这样，先用 `draft`：

```yaml
title: Your title in this language
summary: One-sentence summary in this language
tags:
  - Beginner
difficulty: beginner
readTime: 8
author: Your name
publishedAt: 2026-09-15
reproStatus: pending
version: "0.1"
license: CC-BY-4.0
status: draft
```

## 正文怎么对齐

允许意译，不要硬译。但不得增加、删除或削弱另一语种已经写下的事实、步骤、限制或结论。

两边还要保持：

- 相同的标题层级和顺序
- 相同的列表条数和步骤编号
- 相同的出站链接 URL，且链接必须真实可访问
- 相同的代码块：语言标记、命令、参数、模型 ID、路径逐字一致；只翻译代码外面的说明

不要发明项目、文档、群组、活动、合作、评测数据或产品能力。写不出依据的数字、排行和“官方结论”，就删掉。品牌写作是 **Local AI Club**，`Local AI` 分开写。本社区不是 [LocalAI](https://localai.io/) 开源项目的下属。

## 怎样提交

仓库在 [local-ai-club/local-ai-club-website](https://github.com/local-ai-club/local-ai-club-website)。没有单独的文章后台。

1. Fork 或克隆仓库，从当前默认分支拉出工作分支。
2. 按上面的路径新建两个 Markdown 文件。
3. 先把 `status` 留在 `draft`，写完并互相对齐后再改成 `published`。
4. 在项目根目录运行检查：

```bash
npm test
```

5. 打开 Pull Request，把中英两个文件放进同一次提交。

评审看的是：两边是否成对、主张是否对齐、代码块和外链有没有漂移、有没有写进无法核实的内容。

## 提交前检查

1. 两个文件都在，栏目和 slug 一致。
2. 标题、摘要、正文主张和步骤一一对应。
3. 代码块和链接没有各写各的。
4. 共享 frontmatter 没有被误译。
5. 没有写入无法从正文或公开资料核实的数据。
