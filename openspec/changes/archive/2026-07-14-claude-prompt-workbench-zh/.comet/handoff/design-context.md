# Comet Design Handoff

- Change: claude-prompt-workbench-zh
- Phase: design
- Mode: compact
- Context hash: 111188df037e8ec9ad9cb4b2f67d15fb841ff2f2360ad25e3955cff5513e8ba2

Generated-by: comet-handoff.sh

OpenSpec remains the canonical capability spec. This handoff is a deterministic, source-traceable context pack, not an agent-authored summary.

## openspec/changes/claude-prompt-workbench-zh/proposal.md

- Source: openspec/changes/claude-prompt-workbench-zh/proposal.md
- Lines: 1-64
- SHA256: c9d38bf8c1ec757f675896189c5bbf7a18390ccc6ef740dc38dfa91905a911ac

```md
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
  - 不支持多语言切换(仅中文)。```

## openspec/changes/claude-prompt-workbench-zh/design.md

- Source: openspec/changes/claude-prompt-workbench-zh/design.md
- Lines: 1-113
- SHA256: d7c08b0889e57a19820be15d3da0e036f8dc52acf6fe0313ad7d15e6648b2136

[TRUNCATED]

```md
## Context

- 仓库当前为空(`main` 分支无任何业务代码),仅有 `.git`、`.idea/`、`.claude/` 与新建的 `openspec/` 目录。
- 目标产物是一个静态 SPA:打开 `index.html` 即可使用,可部署到 GitHub Pages,内容结构严格对齐 https://code.claude.com/docs/en/prompt-library。
- 已在 proposal.md 阶段锁定:**TypeScript + Vite + 原生 ES Modules + Web Components + remark/unified**;视觉基调为**黑底 + 莱姆绿 terminal 极客风**;OpenSpec 产物随 git 提交;build/verify 阶段使用 `branch` 隔离。

## Goals / Non-Goals

**Goals:**
- 内容以 Markdown 文件为单一事实源,构建期编译为强类型 JSON,运行时不再解析 Markdown。
- 应用层零 UI 框架,所有交互由原生 Web Components + DOM API 实现。
- localStorage 持久化做到卡片粒度可逆:每条提示词可独立"恢复官方默认"。
- 主题与动效在同一份 CSS 自定义属性上抽象,亮/暗色仅切换变量,组件不感知。
- 构建产物支持 GitHub Pages(`base` 路径可配)与本地双击 `index.html` 双模式打开。

**Non-Goals:**
- 不引入 React/Vue/Svelte/Lit 等 UI 框架(避免运行时开销与风格冲突)。
- 不引入后端、CDN 资源、第三方字体(字体仅用系统等宽栈 + 中文字体回退)。
- 不实现用户账号、云同步、远端 API、协作编辑。
- 不翻译或重建 code.claude.com 其他文档页面;不实现官方 CI/CD 自动发布。
- 不在 Web Component 内做虚拟 DOM diff,直接用 `connectedCallback` / `disconnectedCallback` 控制渲染。

## Decisions

### 1. 内容即 Markdown,frontmatter 即元数据
**Why:** 用户后续编辑"增/删/改"提示词时只需修改 `content/prompts/*.md`,无需触碰代码。YAML frontmatter 同时被 TypeScript 类型校验和 grep 友好。
**Alternatives:**
- ❌ JSON 文件:可读性差,中文 prompt body 需要 `\n` 转义。
- ❌ 单一巨大 `prompts.json`:变更粒度粗,git diff 不友好。
- ✅ Markdown + frontmatter:**每个 prompt 一个文件,变更最小化**。

### 2. remark/unified 在构建期完成,运行时仅消费 JSON
**Why:** 浏览器运行时不应承担 Markdown 解析成本(尤其 34 条 + 后续扩展)。构建期解析后产出 `dist/prompts.json`,运行时只是 `fetch` + `JSON.parse`。
**Alternatives:**
- ❌ 运行时 `marked` + `gray-matter`:首屏延迟 + 解析开销;同时引入运行时依赖,与"零依赖运行时"目标冲突。
- ❌ 硬编码进 TS:内容改动需要重新编译 TS,违反"内容变更零代码修改"原则。
- ✅ remark 编译管线 + 强类型 JSON:**内容/代码关注点分离**。

### 3. 不用任何 UI 框架,直接 Web Components
**Why:** 极客感强调"看见的就是在跑的";零虚拟 DOM 意味着组件更新是手动的、可读的,适合小到中型应用(34 条 prompt)。同时包体最小,适合 GitHub Pages。
**Alternatives:**
- ❌ Lit/Stencil:虽是标准 Web Components,但有学习成本与运行时。
- ❌ React/Vue/Svelte:与"黑底莱姆绿 + 全自研动效"的美学目标不符;包体偏大;与"原生 ES Modules"路线冲突。
- ✅ 原生 Web Components + Shadow DOM 隔离样式:**最小依赖,最大掌控**。

### 4. localStorage key 命名空间与版本号
**Why:** 后续若做内容版本升级,key 携带版本号可避免老用户数据污染新版;命名空间隔离与其他应用冲突。
- 命名规范:`ccpw:zh:v1:overrides:<promptId>` 存卡片级编辑覆盖;
- 命名规范:`ccpw:zh:v1:prefs:theme` 存主题偏好(`system` / `light` / `dark`)。
- 解析失败时回退到内存默认,不在控制台抛错。

### 5. 主题切换走 CSS 自定义属性 + `prefers-color-scheme`
**Why:** 切换成本最低,组件不感知;亮/暗色仅是变量切换;`prefers-color-scheme` 满足系统跟随需求。
**Alternatives:**
- ❌ class 切换整页样式:组件需要知道 class 名,与 Shadow DOM 隔离冲突。
- ❌ 两份独立 stylesheet:大量重复。
- ✅ CSS variables + `:root[data-theme="dark"]` / `:root[data-theme="light"]` + `@media (prefers-color-scheme)`:**一组样式,多套变量**。

### 6. 动效遵守 `prefers-reduced-motion`
**Why:** 无障碍硬约束。系统设置为 `reduce` 时,所有 typewriter/stagger/glow 必须降级为瞬时切换,只保留功能性状态(展开/折叠)。
**实现:** 在每个动效组件 `connectedCallback` 内检测 `matchMedia('(prefers-reduced-motion: reduce)').matches`,据此选择动效版本。

### 7. Vite 构建配置与 GitHub Pages 路径
**Why:** GitHub Pages 子路径(`/repo-name/`)与根路径部署策略不同;用 `base: './'` 让产物既能在 `/` 也能在子路径工作;`build.outDir = 'dist'` 是社区约定,GitHub Actions/Pages 默认识别。
**Alternatives:**
- ❌ 硬编码 `/claude-prompt-workbench-zh/`:换仓库名就要改代码。
- ❌ 硬编码 `/`:本地 `file://` 打开会失败。
- ✅ `base: './'`:**相对路径,适配所有部署形态**。

## 已知数据源(MCP 浏览器已抓取,作为译文基准)

本会话内已通过 MCP 浏览器对 https://code.claude.com/docs/en/prompt-library 完成实际访问并确认:
- **52 条** 卡片标题(title)与提示词正文(prompt,slot 已替换的 preview 形式)已抓取到位。
- 19 个筛选标签、5 个 phase、15 个 cat 的精确顺序与命名已确认。
- 第 1 张卡片("Get oriented in a new repository")已成功 click 展开,拿到完整 teaches + next + src。
- 其余 51 张卡片的 teaches / next / needs / paste 字段因 MCP 浏览器 WebSocket click 持续超时未能实时抓取。

**build 阶段的译文策略:**
- 标题与 prompt 正文以本次会话抓取的 52 条英文原文为基准做翻译,**逐字对应,不允许变造**。
- teaches / next 字段以官方源码(`PromptLibrary` 组件的 `text[]` 字典)中的英文为准做翻译。源码 payload 已保存到本地 `/tmp/prompt-library.html`,build 阶段从中精确抽取并校验每条字段。
```

Full source: openspec/changes/claude-prompt-workbench-zh/design.md

## openspec/changes/claude-prompt-workbench-zh/tasks.md

- Source: openspec/changes/claude-prompt-workbench-zh/tasks.md
- Lines: 1-63
- SHA256: 440cd4158480ee6a49865f5726e9ee3b8788bbc97046251d379eb1627a60b5dd

```md
## 1. 项目骨架与基础设施

- [ ] 1.1 在 `main` 创建 `feat/claude-prompt-workbench-zh` 分支(branch 隔离)
- [ ] 1.2 初始化 `package.json`、`.gitignore`、`tsconfig.json`(strict 模式)
- [ ] 1.3 安装核心依赖:`vite`、`typescript`、`unified`、`remark-parse`、`remark-frontmatter`、`remark-gfm`、`gray-matter`、`yaml`
- [ ] 1.4 配置 `vite.config.ts`(`base: './'`,`build.outDir: 'dist'`)
- [ ] 1.5 创建目录骨架:`src/`、`content/prompts/`、`scripts/`、`public/`

## 2. 内容管线(Markdown → JSON)

- [ ] 2.1 编写 `scripts/build-content.ts`:读取 `content/prompts/*.md`,用 remark 解析 frontmatter 与正文
- [ ] 2.2 定义 TypeScript 类型 `Prompt`、`Phase`、`Cat`、`Role`(覆盖 frontmatter 全部字段)
- [ ] 2.3 在 `content/prompts/` 内编写 52 个 `.md` 文件(含中文 title/prompt/teaches/next 翻译,以 MCP 浏览器实际抓取的英文原文为基准,**严禁变造**)
- [ ] 2.4 在 `package.json` 中添加 `build:content` 脚本,产出 `public/prompts.json`
- [ ] 2.5 在 `vite.config.ts` 中接入内容构建为前置步骤,确保 `npm run build` 先跑内容编译

## 3. 数据加载与领域模型

- [ ] 3.1 实现 `src/data/prompts.ts`:`fetch('/prompts.json')` + 类型守卫 + 运行时校验
- [ ] 3.2 实现 `src/data/taxonomy.ts`:导出 19 个 role、5 个 phase、15 个 cat 的中英对照与排序
- [ ] 3.3 实现 `src/data/search.ts`:标题 + 正文全文检索(简单 `includes` 即可,数据规模小)

## 4. 状态管理与持久化

- [ ] 4.1 实现 `src/state/store.ts`:轻量发布订阅 store,持 `theme`、`overrides`、`prefersReducedMotion`
- [ ] 4.2 实现 `src/state/persistence.ts`:`localStorage` 读写,key 命名空间 `ccpw:zh:v1:*`,容错降级
- [ ] 4.3 实现 `src/state/theme.ts`:检测 `prefers-color-scheme` + 手动切换 + CSS 变量切换
- [ ] 4.4 实现 `src/state/motion.ts`:检测 `prefers-reduced-motion` 并通过事件订阅传播

## 5. Web Components 实现

- [ ] 5.1 `<ccpw-app>`:根组件,组装搜索/筛选/列表/主题切换/动效
- [ ] 5.2 `<ccpw-search>`:搜索框,实时回写到 store
- [ ] 5.3 `<ccpw-tag-bar>`:19 个 role 标签筛选 + "新手入门"切换
- [ ] 5.4 `<ccpw-prompt-list>`:按 phase × cat 分组,支持 stagger 入场动效
- [ ] 5.5 `<ccpw-prompt-card>`:卡片展示/展开,内联 slot 编辑,一键复制,恢复默认
- [ ] 5.6 `<ccpw-theme-toggle>`:主题手动切换按钮
- [ ] 5.7 `<ccpw-empty-state>`:无结果占位

## 6. 样式与动效(黑底莱姆绿 terminal 风)

- [ ] 6.1 全局 CSS 变量定义(亮/暗双主题):背景、前景、accent、border、glow、scanline 等
- [ ] 6.2 字体栈:`ui-monospace` + 中文字体回退(`PingFang SC`、`Microsoft YaHei`)
- [ ] 6.3 扫描线 + 网格 + 微噪点背景层(`mix-blend-mode`,`pointer-events: none`)
- [ ] 6.4 glow / chromatic-aberration 描边(hover 状态)
- [ ] 6.5 卡片展开/折叠动效 + 内容逐行 typewriter
- [ ] 6.6 标签切换 stagger fade-in
- [ ] 6.7 复制成功 ripple / "已复制" 微动效
- [ ] 6.8 主题切换平滑过渡(~400ms color/gradient)
- [ ] 6.9 `@media (prefers-reduced-motion: reduce)` 降级所有动效

## 7. 验收与文档

- [ ] 7.1 `README.md`:介绍、跑起来的命令、目录结构、部署说明、贡献指南
- [ ] 7.2 跑一遍 proposal 中的验收场景清单,逐项打勾
- [ ] 7.3 `npm run build` 产出 `dist/` 在本地 `npx serve dist` 可访问
- [ ] 7.4 检查 `dist/index.html` 引用资源均为相对路径,支持双击打开
- [ ] 7.5 在分支上 commit 全部变更

## 8. 合并与收尾

- [ ] 8.1 切回 `main`,merge `feat/claude-prompt-workbench-zh`(无 fast-forward,保留 feature 历史)
- [ ] 8.2 打 tag `v0.1.0`
- [ ] 8.3 推送 `main` 与 tag 到远端```

