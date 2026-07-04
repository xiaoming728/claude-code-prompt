---
comet_change: claude-prompt-workbench-zh
role: technical-design
canonical_spec: openspec
---

# Claude Prompt Workbench ZH — Technical Design

> OpenSpec canonical spec: `openspec/changes/claude-prompt-workbench-zh/`
> Brainstorm summary: `openspec/changes/claude-prompt-workbench-zh/.comet/handoff/brainstorm-summary.md`

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Build time                                                       │
│  content/prompts/*.md  ──[remark]──▶  public/prompts.json        │
│                                                                │
│  Runtime (browser, file:// or gh-pages)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ <ccpw-app>                                                │  │
│  │   ├ <ccpw-search>      (实时搜索框)                        │  │
│  │   ├ <ccpw-tag-bar>     (19 标签 + "新手入门")                │  │
│  │   ├ <ccpw-prompt-list> (按 phase × cat 分组)                │  │
│  │   │   └ <ccpw-prompt-card> × 52                           │  │
│  │   ├ <ccpw-theme-toggle>(system/light/dark)                │  │
│  │   └ <ccpw-empty-state> (无结果占位)                        │  │
│  │                                                             │  │
│  │  src/state/store.ts       pub/sub (theme, q, sel, …)        │  │
│  │  src/state/persistence.ts localStorage(ccpw:zh:v1:*)        │  │
│  │  src/data/prompts.ts      fetch + 类型守卫                  │  │
│  │  src/theme/tokens.css     CSS Custom Properties            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Stack

- **Language**: TypeScript (strict mode)
- **Bundler**: Vite (`base: './'`, `build.outDir: 'dist'`)
- **Runtime**: 原生 ES Modules + Web Components (零运行时 UI 框架)
- **Content pipeline**: remark / unified / remark-frontmatter / remark-gfm / gray-matter / yaml (Node CLI)
- **Tests**: Vitest (unit) + Playwright (e2e)
- **Package manager**: npm

## 2. Data Model

定义在 `src/types.ts`:

```ts
export type Sdlc = 'discover' | 'design' | 'build' | 'ship' | 'operate';
export type Cat  = 'Onboard' | 'Understand' | 'Plan' | 'Prototype'
                  | 'Implement' | 'Test' | 'Refactor' | 'Review' | 'Steer'
                  | 'Git' | 'Release' | 'Debug' | 'Incident' | 'Data'
                  | 'Automate';
export type Role = 'understand' | 'plan' | 'prototype' | 'build' | 'test'
                  | 'refactor' | 'review' | 'steer' | 'debug' | 'git'
                  | 'release' | 'data' | 'automate' | 'pm' | 'design'
                  | 'docs' | 'marketing' | 'security' | 'ops';
export type Source = 'workflows' | 'teams' | 'legal' | 'cybersecurity'
                   | 'best-practices' | 'ebook';
export type Needs = 'tracker' | 'gh' | 'browser' | 'db';
export type Paste = 'mockup' | 'design' | 'screenshot' | 'plan' | 'error' | 'csv';

export interface Prompt {
  id: string;              // kebab-case,与官方完全一致
  sdlc: Sdlc;
  cat: Cat;
  startN?: number;         // 1..5 (Start here 顺序)
  roles: Role[];           // 0..3
  prompt: string;          // 带 {slot} 的模板
  slots?: Record<string, string>;
  needs?: Needs;
  paste?: Paste;
  nextHref?: string;
  src: Source;
  // 中文译文字段(由 md frontmatter 提供)
  title: string;
  teaches: string;
  next?: string;
}

export interface I18nLabels { /* 见 proposal */ }
export interface I18nTaxonomy { /* 见 proposal */ }
export interface PromptCatalog {
  prompts: Prompt[];
  labels: I18nLabels;
  taxonomy: I18nTaxonomy;
  sources: Record<Source, string>;
}
```

## 3. Content Pipeline

```
content/prompts/*.md              ─── source of truth(中文译文)
       │
       │ scripts/build-content.ts (node CLI)
       │   读取 .md → remark → 解析 frontmatter → 校验
       │   合并 i18n 字典
       ▼
public/prompts.json               ─── 运行时唯一数据源
```

### frontmatter schema

```yaml
---
id: get-oriented-in-a
sdlc: discover
cat: Onboard
startN: 1
roles: []
prompt: |
  give me an overview of this codebase: architecture, key directories, and how the pieces connect
nextHref: /en/memory
src: workflows
title: 快速熟悉一个新仓库
teaches: |
  描述你想知道什么,而非指定要读哪些文件。Claude 会自行探索项目,并返回一份它是如何组合在一起的总结。
next: |
  运行 `/init` 来初始化 `CLAUDE.md`,这样 Claude 每次会话都会带着这个上下文。
---
```

**校验规则**(由 `scripts/build-content.ts` 强制):
- 必填:`id`、`sdlc`、`cat`、`prompt`、`src`、`title`、`teaches`
- 枚举值合法:`sdlc`、`cat`、`roles`、`src`、`needs`、`paste` 必须在 enum 范围内
- 引用一致:`prompt` 中所有 `{slot}` 必须在 `slots` 中存在
- 唯一性:`id` 全局唯一
- startN 范围:`1..5`(如有)

校验失败时,build 失败并打印缺哪条哪个字段。**build 阶段不允许 md 中字段缺失或编造 teaches/next**——这是 proposal 锁定的硬约束。

## 4. Web Components

每个组件一份 `.ts`,Shadow DOM 隔离样式,放在 `src/components/`:

| 组件 | 职责 | 输入 | 输出 |
|---|---|---|---|
| `<ccpw-app>` | 根,组装子组件,绑定 store | — | — |
| `<ccpw-search>` | 搜索框 | `store.q` | `store.set('q', v)` |
| `<ccpw-tag-bar>` | 19 标签 + "新手入门" | `store.sel`, `store.start` | 切换 sel / start |
| `<ccpw-prompt-list>` | 分组 + stagger 入场 | filtered list | — |
| `<ccpw-prompt-card>` | title / slot 编辑 / 复制 / 恢复默认 | `prompt` + overrides | `copy`, `restore` |
| `<ccpw-theme-toggle>` | 主题切换 | `store.theme` | `store.set('theme', v)` |
| `<ccpw-empty-state>` | 无结果占位 | filtered length | — |

每个组件实现要点:
- `connectedCallback`:订阅 store,首次渲染
- `disconnectedCallback`:取消订阅,清理 WAAPI 动画
- `render()`:用 template literal + DOM API 直接构造,不用 vdom

## 5. State Management

`src/state/store.ts` — 极简 pub/sub:

```ts
export interface Store {
  theme: 'system' | 'light' | 'dark';
  q: string;
  sel: Role | null;
  start: boolean;
  overrides: Record<string, { slots?: Record<string,string>; prompt?: string }>;
  prefersReducedMotion: boolean;
}

const subs = new Set<() => void>();
let state: Store = { /* defaults */ };

export function getStore(): Readonly<Store> { return state; }
export function setStore(patch: Partial<Store>): void {
  state = { ...state, ...patch };
  subs.forEach(fn => fn());
}
export function subscribe(fn: () => void): () => void {
  subs.add(fn);
  return () => subs.delete(fn);
}
```

**持久化**(`src/state/persistence.ts`):
- 命名空间:`ccpw:zh:v1:overrides:<id>`、`ccpw:zh:v1:prefs:theme`
- 所有 `localStorage` 调用 try/catch,失败回退内存并 emit `ccpw:storage-error` 事件
- 启动时:从 storage hydrate 主题与 overrides 到 store
- 编辑时:debounce 200ms 写入
- "全部恢复默认":遍历命名空间 key 并删除

**主题**(`src/state/theme.ts`):
- 监听 `matchMedia('(prefers-color-scheme: dark)').addEventListener('change', …)`
- store.theme='system' 时跟随系统,否则手动覆盖
- 写入 `document.documentElement.dataset.theme`,触发 CSS 变量切换

**动效**(`src/state/motion.ts`):
- 启动时检测 `matchMedia('(prefers-reduced-motion: reduce)').matches`,写入 store
- 监听变化事件,动态更新
- 组件在渲染动效前先查 store 决定是否启用

## 6. Theme & Motion Tokens

`src/theme/tokens.css`:

```css
:root {
  --ccpw-accent: #84cc16;     /* 莱姆绿 */
  --ccpw-accent-bg: rgba(132,204,22,0.07);
  --ccpw-bg: #f0eee6;          /* 冷白 */
  --ccpw-surface: #fafaf7;
  --ccpw-border: #e8e6dc;
  --ccpw-text: #141413;
  --ccpw-text-2: #5e5d59;
  --ccpw-text-3: #73726c;
  --ccpw-text-4: #9c9a92;
  --ccpw-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --ccpw-font-sans: -apple-system, BlinkMacSystemFont, 'PingFang SC',
                    'Microsoft YaHei', sans-serif;
  --ccpw-transition: color 400ms, background-color 400ms, border-color 400ms;
}

:root[data-theme="dark"] {
  --ccpw-bg: #0a0e14;          /* 深空 */
  --ccpw-surface: #1a1f26;
  --ccpw-border: #2a313a;
  --ccpw-text: #f0eee6;
  --ccpw-text-2: #bfbdb4;
  --ccpw-text-3: #91908a;
  --ccpw-text-4: #73726c;
  --ccpw-accent: #84cc16;
}
```

**动效**(`src/theme/animations.css`):
- `@keyframes scanline`:垂直扫描线移动
- `@keyframes glow-pulse`:卡片 hover glow
- `@keyframes typewriter`:逐字写入(配合 JS `setInterval`)
- `@keyframes chromatic-shift`:选中态的双色错位
- `@keyframes stagger-in`:列表入场 fade-in + translateY

所有动效封装在 `@media (prefers-reduced-motion: no-preference)` 内,`reduce` 模式下全部降级为瞬时切换。

## 7. Project Layout

```
claude-code-prompt/
├── content/
│   └── prompts/
│       ├── 01-get-oriented-in-a.md
│       ├── 02-explain-unfamiliar-code.md
│       └── ... (52 个 .md 文件)
├── scripts/
│   └── build-content.ts       # remark 编译
├── src/
│   ├── types.ts
│   ├── main.ts                # bootstrap
│   ├── data/
│   │   ├── prompts.ts         # fetch + 校验
│   │   └── i18n.ts            # 内置兜底
│   ├── state/
│   │   ├── store.ts
│   │   ├── persistence.ts
│   │   ├── theme.ts
│   │   └── motion.ts
│   ├── components/
│   │   ├── ccpw-app.ts
│   │   ├── ccpw-search.ts
│   │   ├── ccpw-tag-bar.ts
│   │   ├── ccpw-prompt-list.ts
│   │   ├── ccpw-prompt-card.ts
│   │   ├── ccpw-theme-toggle.ts
│   │   └── ccpw-empty-state.ts
│   ├── theme/
│   │   ├── tokens.css
│   │   └── animations.css
│   └── styles/
│       └── reset.css
├── public/
│   └── prompts.json           # 运行时唯一数据源
├── tests/
│   ├── unit/
│   │   ├── store.test.ts
│   │   ├── persistence.test.ts
│   │   ├── prompts.test.ts
│   │   └── build-content.test.ts
│   └── e2e/
│       ├── browsing.spec.ts
│       ├── editing.spec.ts
│       └── theme.spec.ts
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 8. Testing Strategy

### Vitest 单元测试

- `src/state/store.test.ts`:setter 触发订阅、batch 不重复触发、订阅取消
- `src/state/persistence.test.ts`:localStorage 抛错回退内存、损坏 JSON 静默丢弃、版本号迁移
- `src/data/prompts.test.ts`:fetch 失败回退内置 i18n、类型守卫拒绝未知 enum
- `scripts/build-content.test.ts`:frontmatter 校验(必填、enum、slot 引用、id 唯一、startN 范围)

### Playwright e2e

- `browsing.spec.ts`:
  - 页面加载 52 条卡片渲染完整
  - 默认展示 "新手入门 5 条"
  - 搜索 "rate limit" 仅显示相关卡片
  - 标签筛选(点 Understand 仅显示 Understand 分类)
  - 阶段 × 分类分组渲染正确
- `editing.spec.ts`:
  - 卡片展开后 slot 可编辑
  - 复制按钮按下后剪贴板内容 = 拼装后字符串
  - "恢复官方默认" 按钮清除 override 后回显原始 prompt
  - 刷新后编辑仍在
- `theme.spec.ts`:
  - 主题切换 → `data-theme` 属性变化
  - 系统主题变更 → 自动跟随
  - localStorage 中 theme 字段持久化

## 9. Acceptance Mapping

| 验收场景(来自 proposal) | 对应实现 | 测试 |
|---|---|---|
| 默认展示"新手入门 5 条" | `<ccpw-tag-bar>` start=true + `<ccpw-prompt-list>` start 分组 | e2e browsing |
| 19 筛选标签 + 阶段×分类分组 | `<ccpw-tag-bar>` + 分组逻辑 | e2e browsing |
| 搜索全文检索 | `<ccpw-search>` → store.q → list filter | e2e browsing |
| 卡片展开 + slot 编辑 + 一键复制 | `<ccpw-prompt-card>` + `navigator.clipboard` | e2e editing |
| 刷新后编辑仍在 | `persistence.ts` | e2e editing + unit |
| 跟随系统主题 | `theme.ts` + `matchMedia` | e2e theme |
| 动效齐全 + 遵守 reduced-motion | `animations.css` + `motion.ts` | manual |
| 纯静态可部署 | `vite build` + `dist/` 资源相对路径 | manual |

## 10. Build & Deploy

- `npm run dev`:启动 Vite dev server,内容管线不重跑
- `npm run build:content`:跑 remark 编译 `content/prompts/*.md → public/prompts.json`
- `npm run build`:先 build:content,再 vite build → `dist/`
- `npm run preview`:本地预览 dist
- `npm test`:Vitest
- `npm run e2e`:Playwright(需要先 build)
- 部署:把 `dist/` 推到 gh-pages 分支或 GitHub Actions 配 Pages

## 11. Risks & Mitigations

- **风险 1 — 官方数据缺失**:MCP 浏览器 click 持续 WebSocket 超时,有 51 张卡片的 teaches / next 字段未实时抓到。
  **缓解**:build 阶段从已保存的 React Server Component payload 中精确抽取;若某字段确实在源码中缺失,在中文版本中标注"该卡片暂无官方解释文案",**严禁编造**。
- **风险 2 — localStorage 隐私模式**:Safari/Edge 隐私模式下写入抛错。
  **缓解**:所有读写 try/catch,失败回退内存(本会话内有效),UI 上 toast 提示"此浏览器不支持持久化"。
- **风险 3 — Web Components 兼容性**:Safari < 16.4 部分 edge case 支持不全。
  **缓解**:项目最低支持 evergreen 浏览器;`index.html` `<noscript>` 提示。

## 12. Open Questions

- 是否需要在卡片底部展示"按角色筛选"二级菜单?(官方仅有 19 个一维标签,但 roles 是多值数组)— **v0.1 仅做单标签筛选,留为后续扩展点**。
- 是否需要支持导入/导出 JSON 备份用户编辑?— **v0.1 不做,localStorage 已够用,导出按钮留为后续扩展点**。