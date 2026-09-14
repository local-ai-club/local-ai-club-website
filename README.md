# Local AI Club

`local-ai.club` 网站交互原型。Local AI Club 是面向本地、端侧、边缘与私有化 AI 的开放技术社区，帮助开发者学习技术、选择模型、比较硬件、复现评测、参与项目，并共同解决真实问题。

> Run AI Locally. Build AI Together.

## 原型范围

- “我的设备能运行什么模型”交互选择器；
- 学习、评测、项目、企业级 Agent、悬赏、社区六个栏目视图；
- 企业级 Agent 参考架构、兼容矩阵、知识助手、研发 Agent 与治理示例；
- 栏目筛选与站内搜索状态；
- 面向新手、开发者、项目维护者、企业和高校的参与路径；
- 桌面端与移动端响应式布局；
- 键盘焦点与减少动态效果等基础可访问性支持。

当前设备推荐结果和卡片数据用于验证产品与交互逻辑，不构成正式性能承诺。正式开发阶段应接入结构化的模型、硬件、推理引擎和评测数据库。

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

生产构建与测试：

```bash
npm run build
npm test
```

GitHub Pages 静态导出：

```bash
npm run build:pages
```

导出结果位于 `dist/client/`。仓库中的 `.github/workflows/pages.yml` 会在
`main` 分支更新时自动构建和部署，并根据 GitHub Pages 配置自动处理仓库子路径或自定义域名。

首次使用时，请在仓库的 **Settings → Pages** 中将发布来源设置为
**GitHub Actions**。绑定正式域名时，在同一页面将 Custom domain 设置为
`local-ai.club`。

## 项目结构

```text
app/        页面、交互与全局样式
public/     图标与品牌分享图
worker/     Cloudflare Worker 入口
docs/       社区方案、产品需求文档与汇报材料
tests/      渲染结果测试
```

## 相关文档

- [Local AI Club 社区建设总体方案](docs/01-Local-AI-Club-社区建设总体方案.md)
- [local-ai.club 网站产品需求文档（PRD）](docs/02-local-ai.club-网站产品需求文档-PRD.md)
- [Local AI Club 社区建设汇报（PPT）](docs/04-Local-AI-Club-社区建设汇报.pptx)

## 品牌说明

品牌书写统一采用 **Local AI Club**，其中 `Local AI` 分开书写。

Local AI Club 是关注本地、端侧、边缘及私有化 AI 技术的独立开放社区，与 [LocalAI](https://localai.io/) 开源项目不存在隶属关系。

## 开发状态

当前版本为产品交互原型，主要用于确认社区定位、信息架构、首页重点与核心栏目。代码许可证和内容许可证将在项目正式开放贡献前由社区治理团队确定。
