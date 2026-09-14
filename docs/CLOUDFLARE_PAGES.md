# Cloudflare Pages PR Preview

本项目的生产版本由 GitHub Pages 部署到 `local-ai.club`。Cloudflare Pages 的 GitHub
原生集成仅用于为非生产分支和同仓库内的 Pull Request 创建、持续更新独立预览地址。

## 首次接入

在 Cloudflare Dashboard 的 **Workers & Pages** 中创建 Pages 项目并连接
`local-ai-club/local-ai-club-website`。授权 Cloudflare GitHub App 访问该仓库后，使用以下设置：

| 设置 | 值 |
| --- | --- |
| Production branch | `main`（关闭自动生产部署） |
| Build command | `npm run build:pages` |
| Build output directory | `dist/client` |
| Root directory | `/`（仓库根目录） |
| Environment variable | `NODE_VERSION=24` |

在 **Settings → Builds → Branch control** 中关闭 **Enable automatic production branch
deployments**，并保持 Preview branch deployments 为所有非生产分支。Preview 环境不要
设置 `SITE_URL`，构建会自动使用 Cloudflare 提供的 `CF_PAGES_URL` 生成预览元数据地址。

## PR Preview

来自本仓库分支的 Pull Request 会获得 Cloudflare 状态检查和唯一的 `*.pages.dev` 预览
地址；后续提交会持续更新该 PR 的分支别名。来自 fork 的 Pull Request 不会由原生 Git
集成自动创建预览。合并到 `main` 后，生产发布只由 GitHub Actions 中的
`Deploy GitHub Pages` 工作流负责。

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

`npm test` 会生成并检查供 GitHub Pages 和 Cloudflare Preview 共用的 `dist/client` 静态产物。
