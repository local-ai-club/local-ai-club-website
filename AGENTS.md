# AGENTS.md

本仓库是 [Local AI Club](https://local-ai.club) 网站。中文是站点默认语言（`/`），英文在 `/en`。文章由 Velite 在构建时从 Git 中的 Markdown 编译，不要引入 CMS，也不要编造社区资源。

## 文章路径

一篇文章必须成对出现，共用栏目和 slug：

```text
content/articles/{section}/{slug}/index.zh.md
content/articles/{slug 相同}/index.en.md
```

- `{section}` 只能是：`learn`、`benchmarks`、`projects`、`agents`、`bounties`、`community`。
- `{slug}` 用英文 kebab-case，两种语言文件必须相同。
- 不要把语言写进目录名或 slug。语言只来自文件名 `index.zh.md` / `index.en.md`。

## 翻译合同

- 改一种语言时，必须在同一次改动里更新另一种语言。
- 允许意译，禁止字对字硬译；但不得增加、删除或削弱另一语种已有的事实、步骤、限制或结论。
- 标题层级、段落顺序、列表条数、步骤编号必须对齐。
- 出站链接的 URL 必须一致，且目标必须真实可访问。
- 代码块的语言标记、命令、参数、模型 ID、路径必须逐字相同；只翻译代码块外的说明。
- 不要发明项目、文档、群组、活动、合作、评测数据或产品能力。
- 品牌写作是 **Local AI Club**（`Local AI` 分开写）。不要把本社区写成 LocalAI 开源项目的下属。

## Frontmatter

以下字段两种语言必须同值，不要翻译：

- `difficulty`、`readTime`、`author`、`publishedAt`、`updatedAt`
- `reproStatus`、`version`、`license`、`status`
- `environment.os`、`environment.engine`

以下字段必须翻译，且语义对齐：

- `title`、`summary`、`tags`
- `environment.model`（如中文「7B 级开放模型」对英文 `7B-class open model`）

约束：

- `tags` 条数与含义一致；中文用「入门 / 进阶 / 高级 / 推理引擎」等，英文用 `Beginner` / `Intermediate` / `Advanced` / `Inference engines` 等对应词。
- `status` 必须成对：一边 `published`，另一边不能是 `draft`。未完成的双语稿两边都用 `draft`。
- `readTime`、日期、版本号两边相同。
- 只有两边都是 `published` 的文章才会出现在栏目列表和静态路由里。

## 提交前检查

1. 两个文件都在，路径、section、slug 一致。
2. 标题、摘要、正文主张与步骤一一对应。
3. 代码块和链接未漂移。
4. 共享 frontmatter 未被误译。
5. 没有写入无法从正文或公开资料核实的数据。
