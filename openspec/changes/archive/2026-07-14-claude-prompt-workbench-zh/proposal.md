## Why

官方 Claude Code 文档站(https://code.claude.com/docs/en/prompt-library)维护了一份高质量、按场景/角色分组的提示词工作台,但仅提供英文界面,且不支持编辑、复制之外的自定义上下文与本地持久化。中国用户在使用 Claude Code 时,需要一个本地化、可二次编辑、可随身携带(刷新/重装不丢失)、并且具备明显视觉识别度的提示词工作台,作为日常 prompt 工程的"速查 + 自定义"工具。本变更即构建这一工作台,内容与结构严格对齐官方页面,UI 与交互针对中文用户与极客审美做本地化重塑。

## What Changes

- 新增中文版 Claude Code 提示词工作台 SPA 单页应用。
- 完整还原官方 prompt-library 页面结构:
  - **52 条提示词**(已通过 MCP 浏览器在 https://code.claude.com/docs/en/prompt-library 实际打开并数过 "Show all 52 prompts" 按钮),全部翻译为中文(标题、提示词正文、"为什么有效"原文、"Make it stick" 链接文案)。早期提案中提到的"34 条"是估算错误,以 52 条为准。
  - 19 个角色/场景筛选标签,顺序与官方一致(Understand、Plan、Prototype、Build、Test、Refactor、Review、Steer、Debug、Git、Release、Data、Automate、Product、Design、Docs、Marketing、Security、On-call)。
  - 5 个生命周期阶段分组(Discover、Design、Build、Ship、Operate)与 15 个子分类(Onboard、Understand、Plan、Prototype、Implement、Test、Refactor、Review、Steer、Git、Release、Debug、Incident、Data、Automate)。
  - "新手入门"精选 5 条作为默认首页视图。
  - 全文搜索框(标题与正文)、标签筛选、分组排序逻辑与官方一致。
- 新增本地优先的交互能力:
  - 卡片展开后可内联编辑提示词中的 slot 占位符,实时拼装出最终提示词。
  - 一键复制按钮复制的是**当前编辑后**的内容(而非原始官方默认)。
  - 用户所有编辑实时保存到浏览器 `localStorage`,刷新后仍在。
  - 提供"恢复官方默认"按钮,清除当前卡片的本地修改。
- 新增视觉与主题:
  - 黑底 + 莱姆绿 terminal 极客风(深空近黑 + 等宽字体 + 扫描线/网格/glow)。
  - 跟随系统 `prefers-color-scheme` 自动切换亮/暗主题,亮色模式为冷白底配莱姆绿 accent。
  - 终端/扫描线/typewriter/stagger/chromatic-aberration 等动效齐全,且遵守 `prefers-reduced-motion: reduce`。
- 新增构建与部署:
  - 内容以 Markdown 文件 + YAML frontmatter 形式存放在 `content/prompts/`,构建期由 remark/unified 编译为强类型 JSON。
  - 应用层 TypeScript + Vite + 原生 ES Modules + Web Components,零运行时 UI 框架。
  - 构建产物为静态文件,可直接部署到 GitHub Pages(`dist/` 目录)或离线打开。

## Capabilities

### New Capabilities

- `prompt-catalog`: 提示词目录的数据模型、Markdown 加载与解析、强类型 JSON 形态。
- `prompt-browsing`: 搜索、标签筛选、分组、排序、新手入门精选视图、卡片展开/折叠。
- `prompt-editing`: slot 内联编辑、实时拼装、"恢复官方默认"、编辑状态读写。
- `clipboard-copy`: 一键复制当前编辑内容,带视觉反馈(ripple / "已复制" 微动效)。
- `local-persistence`: 用户编辑内容以卡片粒度持久化到 `localStorage`,key 命名空间、版本号、容错降级。
- `theme-system`: 系统主题自动检测、手动切换、亮/暗色变量、CSS 自定义属性管线。
- `motion-system`: 终端/扫描线/glow/typewriter/stagger/chromatic-aberration 等动效规范,遵守 `prefers-reduced-motion`。
- `static-build-deploy`: Vite 构建配置、`base` 路径、GitHub Pages 部署约定。

### Modified Capabilities

无。本次变更为全新能力引入,不修改任何已存在的 spec。

## Impact

- **新增代码与目录**:
  - `content/prompts/*.md` — 52 个 Markdown 文件,每个含 YAML frontmatter(id/cat/phase/roles/slots/needs/paste/src/title/teaches/next/startN)
  - `src/` — TypeScript 源码、Web Components、样式、状态管理
  - `scripts/build-content.ts` — remark/unified 编译管线
  - `vite.config.ts`、`tsconfig.json`、`package.json`
  - `dist/` — 构建产物(GitHub Pages 部署目标)
  - `.github/workflows/pages.yml`(可选,CI/CD,不在本次 scope 内,先留为后续扩展点)
- **新增依赖**(均为运行时或构建期):
  - `vite`(构建)
  - `typescript`(类型)
  - `unified`、`remark-parse`、`remark-frontmatter`、`remark-gfm`、`gray-matter`、`yaml`(内容管线)
- **OpenSpec 与 git**:
  - `openspec/` 目录随 git 提交,`/comet` 状态机元数据(`.comet.yaml`)同样入库。
  - 主分支隔离策略:**branch 隔离**(在 build/verify 阶段切换到 `feat/claude-prompt-workbench-zh` 分支),完工后 merge 回 `main`。
- **不影响范围**:
  - 不翻译或重建 code.claude.com 其他文档页面。
  - 不引入用户账号、远端同步、远端 API。
  - 不做官方 CI/CD 自动化发布(用户可后续自行加 `.github/workflows/pages.yml`)。
  - 不支持多语言切换(仅中文)。