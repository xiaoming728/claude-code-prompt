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
- 如果某条字段在源码或抓取中确实缺失,该字段在中文版本中以"该卡片暂无官方解释文案"占位,**绝不允许编造 teaches/next**。

##
**Why:** "恢复官方默认"按钮不是删除 localStorage key,而是把当前卡片渲染切回 `RAW.prompt` + `RAW.slots` 的拼接结果;key 仍在,只是当前会话优先显示官方默认。再次编辑会重新写入。这避免误删用户在其他卡片的编辑。
- 用户操作"恢复默认"的卡片 → 该卡片本次会话临时回显官方默认,但 localStorage 中的 override 保留;若用户再次编辑,值被刷新。
- 提供"全部恢复官方默认"二级按钮,真清空所有 `ccpw:zh:v1:overrides:*` key。

## Risks / Trade-offs

- **[风险] Web Components 兼容性**:Safari < 16.4 在某些 edge case 上支持不全。
  **缓解**:只在支持的浏览器上运行,`index.html` 内 `<noscript>` 提示;主流 evergreen 浏览器全部支持。
- **[风险] 中文 Markdown 文件名在不同 OS/git 上大小写/编码差异**。
  **缓解**:统一使用 kebab-case 英文文件名 + ASCII frontmatter;中文仅出现在 `title`/`prompt`/`teaches` 字段内。
- **[风险] 黑底莱姆绿 + 扫描线在某些显示器上的可读性差**。
  **缓解**:扫描线使用 `mix-blend-mode: overlay` + 极低 opacity,提供"减少动效"开关在 UI 内置,与 `prefers-reduced-motion` 联动。
- **[风险] localStorage 在隐私模式下不可用**。
  **缓解**:写入前 try/catch,失败时回退到内存(本会话内有效),并在 UI 上提示"此浏览器不支持持久化"。
- **[Trade-off] 构建期解析 Markdown 增加了构建耗时**(34 个文件 ~ 数百毫秒,可忽略)。
- **[Trade-off] 不引 UI 框架意味着手动管理组件更新**,开发速度略低于框架方案,但本应用规模小,组件数 < 10。

## Migration Plan

本次为全新应用,无既有用户数据,无回滚需求:
1. `main` 分支创建 `feat/claude-prompt-workbench-zh` 分支(branch 隔离)。
2. 在 feature 分支完成所有 tasks;每个 task 完成后 commit。
3. verify 阶段:本地 `npm run build && npm run preview` 验收 + 浏览器手动跑过验收场景。
4. merge 回 `main`,tag `v0.1.0`。
5. 后续:用户自行决定是否启用 GitHub Pages 部署(本变更不自动配 CI/CD)。

## Open Questions

- (已在 proposal 锁定) 外部英文原文链接如何处理 → **保留为可点击的外部链接,跳转到 https://code.claude.com/docs/...**。
- (已在 proposal 锁定) 34 条翻译由 design/build 阶段直接产出 → **Design Doc 末尾附"译文样例(3-5 条)以便审阅",build 阶段产出完整 34 条**。
- 是否需要支持自定义新增提示词(超出 34 条官方列表)? → **本次 scope 不支持,仅消费 `content/prompts/` 内文件;后续可扩展为允许用户在 UI 内新增,但涉及 localStorage schema 演进,不在本次变更内**。