# Cloudflare Pages 部署

本项目使用 Cloudflare Pages 的 GitHub 原生集成部署。Cloudflare 会在 `main`
更新时部署生产版本，并为同仓库内的每个 Pull Request 创建和持续更新独立的预览地址。

## 首次接入

在 Cloudflare Dashboard 的 **Workers & Pages** 中创建 Pages 项目并连接
`local-ai-club/local-ai-club-website`。授权 Cloudflare GitHub App 访问该仓库后，使用以下设置：

| 设置 | 值 |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build:pages` |
| Build output directory | `dist/client` |
| Root directory | `/`（仓库根目录） |
| Environment variable | `NODE_VERSION=24` |

使用默认 `*.pages.dev` 域名时，Production 和 Preview 环境都不要设置 `SITE_URL`，
构建会自动使用 Cloudflare 提供的 `CF_PAGES_URL` 生成当前部署的元数据地址。以后绑定
自定义域名时，再只为 Production 环境设置对应的 `SITE_URL`。

## PR Preview

保持 Preview branch deployments 为启用状态，并选择所有非生产分支。来自本仓库分支的
Pull Request 会获得 Cloudflare 状态检查和唯一的 `*.pages.dev` 预览地址；后续提交会持续
更新该 PR 的分支别名。来自 fork 的 Pull Request 不会由原生 Git 集成自动创建预览。

Cloudflare 默认给 Preview Deployment 响应添加 `X-Robots-Tag: noindex`。预览部署完成后可用：

```bash
curl -I https://<preview-url>.pages.dev
```

确认响应为成功状态并包含 `x-robots-tag: noindex`。

## 本地验证

```bash
npm test
npm run lint
```

`npm test` 会生成并检查与 Cloudflare Pages 设置一致的 `dist/client` 静态产物。
