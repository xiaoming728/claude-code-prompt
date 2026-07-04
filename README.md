# Claude 提示词工作台(中文版)

中文版 Claude Code 提示词工作台 SPA,内容/分类/交互严格对应官方 [prompt-library](https://code.claude.com/docs/en/prompt-library),支持内联编辑、一键复制、localStorage 持久化、恢复官方默认、系统亮/暗色自动切换,黑底 + 莱姆绿 terminal 极客风。

## 跑起来

```bash
npm install
npm run build:content   # 解析 content/prompts/*.md → public/prompts.json
npm run dev              # 启动 Vite dev server (http://localhost:5173)
```

## 构建与部署

```bash
npm run build       # build:content + vite build → dist/
npm run preview     # 本地预览 dist (http://localhost:4173)
```

把 `dist/` 目录推到 `gh-pages` 分支或 GitHub Pages 即可部署。

## 目录结构

```
content/prompts/    52 条 md(中文译文,权威源)
public/prompts.json 编译产物(运行时唯一数据源)
src/                TypeScript + Web Components
scripts/            内容编译管线
tests/unit/         Vitest 单元
tests/e2e/          Playwright e2e
```

## 测试

```bash
npm test            # Vitest 单元
npm run e2e         # Playwright e2e(需先 build)
```

## 数据来源

内容来自 [Anthropic 官方 prompt-library](https://code.claude.com/docs/en/prompt-library),由 MCP 浏览器实际访问并确认 52 条卡片。所有译文以官方原文为准,**任何字段缺失时标注"该卡片暂无官方解释文案",严禁编造**。

## License

仅作学习与个人使用。Claude Code 与 Anthropic 商标归其所有者所有。