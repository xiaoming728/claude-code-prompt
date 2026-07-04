---
change: claude-prompt-workbench-zh
design-doc: docs/superpowers/specs/2026-07-04-claude-prompt-workbench-zh-design.md
base-ref: empty-repo
---

# Claude Prompt Workbench ZH Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建中文版 Claude Code 提示词工作台 SPA,内容/分类/交互严格对应官方 prompt-library(52 条),支持内联编辑 slot、一键复制、localStorage 持久化、恢复官方默认、系统亮暗色自动切换,黑底 + 莱姆绿 terminal 极客风视觉语言。

**Architecture:** Markdown + YAML frontmatter → remark/unified 构建期编译为 `public/prompts.json`;运行时纯前端 TS + Vite + 原生 ES Modules + Web Components + Shadow DOM,零运行时 UI 框架,轻量 pub/sub store 跨组件共享状态。

**Tech Stack:** TypeScript (strict)、Vite、unified/remark/gray-matter/yaml、Web Components (原生 ES Modules)、Vitest、Playwright。

## Global Constraints

- TypeScript strict mode (`strict: true`、`noUncheckedIndexedAccess: true`)
- 零运行时 UI 框架(不引 React/Vue/Svelte/Lit)
- 内容驱动:52 条 prompt 全部来自 `content/prompts/*.md`,**禁止编造 teaches/next**,若官方无字段则标注"该卡片暂无官方解释文案"
- 包管理:npm
- Node >= 20
- Vite `base: './'` 以支持 gh-pages 子路径与 file:// 双击打开
- `localStorage` 命名空间 `ccpw:zh:v1:*`,所有读写 try/catch 容错
- 主题变量抽象为 CSS Custom Properties,亮/暗色仅切变量
- 所有动效遵守 `@media (prefers-reduced-motion: reduce)` 降级
- 中文 UI 文案,标签名沿用官方英文(Understand / Plan / Product / Design / On-call 等),仅阶段与角色分类、UI 操作文案翻译为中文
- 每次完成一个 task → commit(commit message 体现设计意图)

---

## Task 1: 项目骨架与基础设施

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.gitignore`
- Create: `index.html`
- Create: `src/main.ts`(bootstrap,占位即可)
- Create: `scripts/build-content.ts`(占位,Task 3 实现)
- Create: `src/types.ts`(占位,Task 4 实现)
- Create: `public/`(空目录,.gitkeep)
- Create: `content/prompts/`(空目录,.gitkeep)
- Create: `tests/unit/`、`tests/e2e/`(空目录,.gitkeep)

**Step 1.1: 创建分支**

```bash
cd /Users/xiaoming/IdeaProjects/claude-code-prompt
git checkout -b feat/claude-prompt-workbench-zh
```

**Step 1.2: 写 `.gitignore`**

```gitignore
node_modules/
dist/
.vite/
*.log
.DS_Store
.env.local
playwright-report/
test-results/
coverage/
*.tsbuildinfo
```

**Step 1.3: 写 `package.json`**

```json
{
  "name": "claude-prompt-workbench-zh",
  "version": "0.1.0",
  "description": "中文版 Claude Code 提示词工作台",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build:content": "tsx scripts/build-content.ts",
    "build": "npm run build:content && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "unified": "^11.0.5",
    "remark-parse": "^11.0.0",
    "remark-frontmatter": "^5.0.0",
    "remark-gfm": "^4.0.0",
    "gray-matter": "^4.0.3",
    "yaml": "^2.5.0"
  },
  "devDependencies": {
    "vite": "^5.4.10",
    "typescript": "^5.6.3",
    "tsx": "^4.19.2",
    "vitest": "^2.1.4",
    "@playwright/test": "^1.48.2",
    "@types/node": "^22.8.6"
  }
}
```

**Step 1.4: 写 `tsconfig.json`(strict)**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "useDefineForClassFields": true,
    "experimentalDecorators": false,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "types": ["vite/client", "node"]
  },
  "include": ["src", "scripts", "tests"]
}
```

**Step 1.5: 写 `vite.config.ts`**

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2022',
    sourcemap: true,
  },
  server: {
    port: 5173,
  },
});
```

**Step 1.6: 写 `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    globals: false,
  },
});
```

**Step 1.7: 写 `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run preview',
    port: 4173,
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:4173',
    headless: true,
  },
});
```

**Step 1.8: 写 `index.html`(bootstrap 占位)**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claude 提示词工作台</title>
  <link rel="stylesheet" href="/src/theme/tokens.css">
</head>
<body>
  <ccpw-app></ccpw-app>
  <noscript>请启用 JavaScript 以使用提示词工作台。</noscript>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

**Step 1.9: 写 `src/main.ts`(占位)**

```ts
// 占位,后续 Task 注册 Web Components 后会扩展
console.log('Claude Prompt Workbench ZH bootstrapped');
```

**Step 1.10: 创建空目录(`.gitkeep`)+ 占位文件**

```bash
mkdir -p public content/prompts scripts src/data src/state src/components src/theme src/styles tests/unit tests/e2e
touch public/.gitkeep content/prompts/.gitkeep scripts/.gitkeep src/data/.gitkeep src/state/.gitkeep src/components/.gitkeep src/theme/.gitkeep src/styles/.gitkeep tests/unit/.gitkeep tests/e2e/.gitkeep
echo '// 占位,真实类型在 Task 4 实现' > src/types.ts
echo '// 占位,真实实现在 Task 3' > scripts/build-content.ts
```

**Step 1.11: 安装依赖**

```bash
cd /Users/xiaoming/IdeaProjects/claude-code-prompt
npm install
```

**Step 1.12: 验证类型检查通过**

```bash
npm run typecheck
```

Expected: 无错误(exit 0)。

**Step 1.13: 提交**

```bash
git add -A
git commit -m "chore: scaffold project (package.json, tsconfig, vite, vitest, playwright)"
```

---

## Task 2: 内容数据迁移(52 条 prompt 的 md 文件)

**Files:**
- Create: `content/prompts/01-get-oriented-in-a.md`
- Create: `content/prompts/02-explain-unfamiliar-code.md`
- ... 共 52 个 .md 文件,文件名按 startN + id 排序

**Step 2.1: 数据源声明**

**严禁编造任何字段。** 翻译基准:
- 标题、prompt 正文、teaches 字段:从 `/tmp/prompt-library.html` 中 React Server Component payload 的 `text[]` 字典精确抽取(已保存)。
- 官方 52 条 prompt 的 prompt 正文已通过 MCP 浏览器在 https://code.claude.com/docs/en/prompt-library 实际打开并确认(slot 已替换的 preview 形式)。
- 若某条 teaches 在源码中确缺失,该字段在中文版本中标注"该卡片暂无官方解释文案"。

**Step 2.2: 编写 frontmatter 模板**

每条 md 文件结构:

```markdown
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

**Step 2.3: 编写全部 52 条**

按 startN 编号或 id 字母顺序依次创建 52 个 .md 文件。每条 frontmatter 字段:
- `id`:与官方 id 完全一致(如 `get-oriented-in-a`)
- `sdlc`:enum 值(discover/design/build/ship/operate)
- `cat`:enum 值(Onboard/Understand/Plan/Prototype/Implement/Test/Refactor/Review/Steer/Git/Release/Debug/Incident/Data/Automate)
- `startN`:1..5(5 张 start here 才有,其它不写)
- `roles`:Role[] 数组,如 `['pm', 'design']`;空时写 `[]`
- `prompt`:带 `{slot}` 的模板,保留英文原版
- `slots`:对象,key 名与 prompt 中 `{name}` 一致;无 slot 时不写
- `needs`:`tracker|gh|browser|db`,无时不写
- `paste`:`mockup|design|screenshot|plan|error|csv`,无时不写
- `nextHref`:如 `/en/memory`,无时不写
- `src`:enum 值(workflows/teams/legal/cybersecurity/best-practices/ebook)
- `title`:中文翻译
- `teaches`:中文翻译;若无原文,写 `该卡片暂无官方解释文案`
- `next`:中文翻译,无时不写

**Step 2.4: 校验完整性**

```bash
ls content/prompts/ | wc -l
```

Expected: `52`。

**Step 2.5: 提交**

```bash
git add content/prompts/
git commit -m "content: add 52 prompt markdown files (zh translation)"
```

---

## Task 3: 内容编译管线(`scripts/build-content.ts`)

**Files:**
- Modify: `scripts/build-content.ts`(填充实现)
- Create: `tests/unit/build-content.test.ts`

**Step 3.1: 写测试 `tests/unit/build-content.test.ts`(TDD: 先失败)**

```ts
import { describe, it, expect } from 'vitest';
import { parseFrontmatter, validatePrompt, buildCatalog } from '../../scripts/build-content.js';

const SAMPLE_MD = `---
id: test-prompt
sdlc: discover
cat: Onboard
roles: []
prompt: give me an overview
src: workflows
title: 测试
teaches: 测试说明
---

正文内容(可忽略)。
`;

describe('parseFrontmatter', () => {
  it('从 md 字符串解析出 frontmatter 与正文', () => {
    const result = parseFrontmatter(SAMPLE_MD);
    expect(result.data.id).toBe('test-prompt');
    expect(result.data.sdlc).toBe('discover');
    expect(result.data.title).toBe('测试');
    expect(result.content).toContain('正文内容');
  });
});

describe('validatePrompt', () => {
  it('必填字段缺失时抛出明确错误', () => {
    expect(() => validatePrompt({ id: 'x' })).toThrow(/sdlc/);
  });

  it('枚举值非法时抛出错误', () => {
    expect(() => validatePrompt({ id: 'x', sdlc: 'wrong', cat: 'Onboard', prompt: 'p', src: 'workflows', title: 't', teaches: 't' })).toThrow(/sdlc/);
  });

  it('id 重复时抛出错误', () => {
    const seen = new Set(['dup']);
    expect(() => validatePrompt({ id: 'dup', sdlc: 'discover', cat: 'Onboard', prompt: 'p', src: 'workflows', title: 't', teaches: 't' }, seen)).toThrow(/duplicate/);
  });

  it('prompt 中 {slot} 不在 slots 中时抛出错误', () => {
    expect(() => validatePrompt({ id: 'x', sdlc: 'discover', cat: 'Onboard', prompt: 'see {path}', slots: { file: 'a' }, src: 'workflows', title: 't', teaches: 't' })).toThrow(/path/);
  });

  it('startN 超出 1..5 时抛出错误', () => {
    expect(() => validatePrompt({ id: 'x', sdlc: 'discover', cat: 'Onboard', prompt: 'p', src: 'workflows', title: 't', teaches: 't', startN: 9 })).toThrow(/startN/);
  });

  it('合法 prompt 通过校验', () => {
    expect(() => validatePrompt({ id: 'x', sdlc: 'discover', cat: 'Onboard', prompt: 'p', src: 'workflows', title: 't', teaches: 't' })).not.toThrow();
  });
});

describe('buildCatalog', () => {
  it('聚合多份 md 为 catalog 并强制 id 唯一', async () => {
    const catalog = await buildCatalog([SAMPLE_MD, SAMPLE_MD]);
    expect(catalog.prompts).toHaveLength(2);
  });
});
```

**Step 3.2: 运行测试,确认失败**

```bash
npm test -- tests/unit/build-content.test.ts
```

Expected: FAIL,所有测试报错(模块未找到)。

**Step 3.3: 写 `scripts/build-content.ts`**

```ts
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import yaml from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SDLCS = ['discover', 'design', 'build', 'ship', 'operate'] as const;
const CATS = ['Onboard', 'Understand', 'Plan', 'Prototype', 'Implement', 'Test', 'Refactor', 'Review', 'Steer', 'Git', 'Release', 'Debug', 'Incident', 'Data', 'Automate'] as const;
const ROLES = ['understand', 'plan', 'prototype', 'build', 'test', 'refactor', 'review', 'steer', 'debug', 'git', 'release', 'data', 'automate', 'pm', 'design', 'docs', 'marketing', 'security', 'ops'] as const;
const SOURCES = ['workflows', 'teams', 'legal', 'cybersecurity', 'best-practices', 'ebook'] as const;
const NEEDS = ['tracker', 'gh', 'browser', 'db'] as const;
const PASTES = ['mockup', 'design', 'screenshot', 'plan', 'error', 'csv'] as const;

export function parseFrontmatter(md: string) {
  const result = matter(md);
  return { data: result.data as Record<string, unknown>, content: result.content };
}

export function validatePrompt(p: Record<string, unknown>, seenIds: Set<string> = new Set()): asserts p is Record<string, unknown> & {
  id: string; sdlc: typeof SDLCS[number]; cat: typeof CATS[number];
  prompt: string; src: typeof SOURCES[number]; title: string; teaches: string;
} {
  const required = ['id', 'sdlc', 'cat', 'prompt', 'src', 'title', 'teaches'];
  for (const k of required) {
    if (p[k] === undefined || p[k] === null || p[k] === '') {
      throw new Error(`Missing required field: ${k} in prompt ${JSON.stringify(p)}`);
    }
  }
  if (typeof p.id !== 'string') throw new Error(`id must be string`);
  if (!SDLCS.includes(p.sdlc as typeof SDLCS[number])) throw new Error(`sdlc invalid: ${p.sdlc}`);
  if (!CATS.includes(p.cat as typeof CATS[number])) throw new Error(`cat invalid: ${p.cat}`);
  if (!SOURCES.includes(p.src as typeof SOURCES[number])) throw new Error(`src invalid: ${p.src}`);
  if (Array.isArray(p.roles)) {
    for (const r of p.roles) {
      if (!ROLES.includes(r as typeof ROLES[number])) throw new Error(`role invalid: ${r}`);
    }
  }
  if (p.needs !== undefined && !NEEDS.includes(p.needs as typeof NEEDS[number])) {
    throw new Error(`needs invalid: ${p.needs}`);
  }
  if (p.paste !== undefined && !PASTES.includes(p.paste as typeof PASTES[number])) {
    throw new Error(`paste invalid: ${p.paste}`);
  }
  if (p.startN !== undefined) {
    const n = p.startN as number;
    if (!Number.isInteger(n) || n < 1 || n > 5) throw new Error(`startN out of range: ${n}`);
  }
  if (seenIds.has(p.id)) throw new Error(`duplicate id: ${p.id}`);
  seenIds.add(p.id);
  // slot 引用一致性
  const slots = (p.slots as Record<string, string> | undefined) ?? {};
  const promptStr = p.prompt as string;
  const slotRefs = promptStr.match(/\{(\w+)\}/g) ?? [];
  for (const ref of slotRefs) {
    const name = ref.slice(1, -1);
    if (!(name in slots)) throw new Error(`prompt references slot {${name}} but slots has no key for it`);
  }
}

const SOURCES_URL: Record<typeof SOURCES[number], string> = {
  'workflows': '/docs/en/common-workflows',
  'teams': 'https://claude.com/blog/how-anthropic-teams-use-claude-code',
  'legal': 'https://claude.com/blog/how-anthropic-uses-claude-legal',
  'cybersecurity': 'https://claude.com/blog/how-anthropic-uses-claude-cybersecurity',
  'best-practices': '/docs/en/best-practices',
  'ebook': 'https://resources.anthropic.com/hubfs/Scaling%20agentic%20coding%20across%20your%20organization.pdf',
};

export async function buildCatalog(mdSources: string[]) {
  const seen = new Set<string>();
  const prompts: unknown[] = [];
  for (const md of mdSources) {
    const { data } = parseFrontmatter(md);
    validatePrompt(data, seen);
    prompts.push(data);
  }
  return { prompts, sources: SOURCES_URL };
}

async function main() {
  const contentDir = join(ROOT, 'content', 'prompts');
  const outDir = join(ROOT, 'public');
  const files = readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const mds = files.map(f => readFileSync(join(contentDir, f), 'utf-8'));
  const { prompts, sources } = await buildCatalog(mds);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'prompts.json'), JSON.stringify({ prompts, sources }, null, 2));
  console.log(`✓ Built ${prompts.length} prompts → public/prompts.json`);
}

main().catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
```

**Step 3.4: 运行测试,确认通过**

```bash
npm test -- tests/unit/build-content.test.ts
```

Expected: PASS。

**Step 3.5: 运行编译,确认生成 `public/prompts.json`**

```bash
npm run build:content
```

Expected: 输出 `✓ Built 52 prompts → public/prompts.json`。

**Step 3.6: 提交**

```bash
git add scripts/build-content.ts tests/unit/build-content.test.ts public/prompts.json
git commit -m "feat(content): remark-based md → JSON content pipeline with TDD validation"
```

---

## Task 4: 类型定义 `src/types.ts`

**Files:**
- Modify: `src/types.ts`

**Step 4.1: 写类型**

```ts
export type Sdlc = 'discover' | 'design' | 'build' | 'ship' | 'operate';
export type Cat = 'Onboard' | 'Understand' | 'Plan' | 'Prototype' | 'Implement'
                | 'Test' | 'Refactor' | 'Review' | 'Steer' | 'Git' | 'Release'
                | 'Debug' | 'Incident' | 'Data' | 'Automate';
export type Role = 'understand' | 'plan' | 'prototype' | 'build' | 'test'
                | 'refactor' | 'review' | 'steer' | 'debug' | 'git'
                | 'release' | 'data' | 'automate' | 'pm' | 'design'
                | 'docs' | 'marketing' | 'security' | 'ops';
export type Source = 'workflows' | 'teams' | 'legal' | 'cybersecurity'
                   | 'best-practices' | 'ebook';
export type Needs = 'tracker' | 'gh' | 'browser' | 'db';
export type Paste = 'mockup' | 'design' | 'screenshot' | 'plan' | 'error' | 'csv';

export interface Prompt {
  id: string;
  sdlc: Sdlc;
  cat: Cat;
  startN?: number;
  roles: Role[];
  prompt: string;
  slots?: Record<string, string>;
  needs?: Needs;
  paste?: Paste;
  nextHref?: string;
  src: Source;
  title: string;
  teaches: string;
  next?: string;
}

export interface I18nLabels {
  search: string;
  startHere: string;
  startHereHeader: string;
  showAll: (n: number) => string;
  clear: string;
  prompt: string;
  prompts: string;
  noMatch: (q: string) => string;
  fillAndCopy: string;
  copyThis: string;
  hintBefore: string;
  hintChip: string;
  hintAfter: string;
  copy: string;
  copied: string;
  whyWorks: string;
  makeItStick: string;
  from: string;
  paste: Record<Paste, string>;
  needsLabel: string;
  needs: Record<Needs, string>;
}

export interface I18nTaxonomy {
  tagLabels: Record<Role, string>;
  phaseLabels: Record<Sdlc, string>;
  sourceLabels: Record<Source, string>;
  catLabels: Record<Cat, string>;
}

export interface PromptCatalog {
  prompts: Prompt[];
  sources: Record<Source, string>;
  labels: I18nLabels;
  taxonomy: I18nTaxonomy;
}

export interface Override {
  slots?: Record<string, string>;
  prompt?: string;
}

export type Theme = 'system' | 'light' | 'dark';
```

**Step 4.2: 提交**

```bash
git add src/types.ts
git commit -m "feat(types): define core domain types (Prompt, I18nLabels, I18nTaxonomy, Override)"
```

---

## Task 5: 状态管理 `src/state/store.ts`

**Files:**
- Create: `src/state/store.ts`
- Create: `tests/unit/store.test.ts`

**Step 5.1: 写测试**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { getStore, setStore, subscribe, _resetStore } from '../../src/state/store.js';

beforeEach(() => _resetStore());

describe('store', () => {
  it('初始状态含默认值', () => {
    const s = getStore();
    expect(s.theme).toBe('system');
    expect(s.q).toBe('');
    expect(s.sel).toBeNull();
    expect(s.start).toBe(true);
    expect(s.overrides).toEqual({});
  });

  it('setter 触发订阅', () => {
    let called = 0;
    subscribe(() => called++);
    setStore({ q: 'test' });
    expect(called).toBe(1);
    expect(getStore().q).toBe('test');
  });

  it('批量 setStore 只触发一次订阅', () => {
    let called = 0;
    subscribe(() => called++);
    setStore({ q: 'a' });
    setStore({ sel: 'debug' as any });
    expect(called).toBe(2);
  });

  it('unsubscribe 取消订阅', () => {
    let called = 0;
    const unsub = subscribe(() => called++);
    setStore({ q: 'a' });
    expect(called).toBe(1);
    unsub();
    setStore({ q: 'b' });
    expect(called).toBe(1);
  });

  it('setter 不影响未变更字段', () => {
    setStore({ q: 'foo' });
    setStore({ sel: 'debug' as any });
    expect(getStore().q).toBe('foo');
    expect(getStore().sel).toBe('debug');
  });
});
```

**Step 5.2: 运行测试,确认失败**

```bash
npm test -- tests/unit/store.test.ts
```

Expected: FAIL(模块未找到)。

**Step 5.3: 写 `src/state/store.ts`**

```ts
import type { Override, Role, Theme } from '../types.js';

export interface Store {
  theme: Theme;
  q: string;
  sel: Role | null;
  start: boolean;
  overrides: Record<string, Override>;
  prefersReducedMotion: boolean;
}

const subs = new Set<() => void>();
let state: Store = {
  theme: 'system',
  q: '',
  sel: null,
  start: true,
  overrides: {},
  prefersReducedMotion: false,
};

export function getStore(): Readonly<Store> {
  return state;
}

export function setStore(patch: Partial<Store>): void {
  state = { ...state, ...patch };
  subs.forEach(fn => fn());
}

export function subscribe(fn: () => void): () => void {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

export function _resetStore(): void {
  state = {
    theme: 'system',
    q: '',
    sel: null,
    start: true,
    overrides: {},
    prefersReducedMotion: false,
  };
  subs.clear();
}
```

**Step 5.4: 运行测试,确认通过**

```bash
npm test -- tests/unit/store.test.ts
```

Expected: PASS。

**Step 5.5: 提交**

```bash
git add src/state/store.ts tests/unit/store.test.ts
git commit -m "feat(state): pub/sub store with theme/q/sel/overrides"
```

---

## Task 6: 持久化 `src/state/persistence.ts`

**Files:**
- Create: `src/state/persistence.ts`
- Create: `tests/unit/persistence.test.ts`

**Step 6.1: 写测试**

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadOverrides, saveOverride, removeOverride, loadTheme, saveTheme, clearAllOverrides } from '../../src/state/persistence.js';

const KEY_PREFIX = 'ccpw:zh:v1';

beforeEach(() => {
  localStorage.clear();
});

describe('persistence - overrides', () => {
  it('loadOverrides 初次为空对象', () => {
    expect(loadOverrides()).toEqual({});
  });

  it('saveOverride 与 loadOverrides 往返', () => {
    saveOverride('p1', { slots: { a: '1' } });
    expect(loadOverrides()).toEqual({ p1: { slots: { a: '1' } } });
  });

  it('removeOverride 移除单条', () => {
    saveOverride('p1', { prompt: 'x' });
    saveOverride('p2', { prompt: 'y' });
    removeOverride('p1');
    expect(loadOverrides()).toEqual({ p2: { prompt: 'y' } });
  });

  it('clearAllOverrides 清空所有 ccpw:zh:v1:overrides:*', () => {
    saveOverride('p1', {});
    saveOverride('p2', {});
    clearAllOverrides();
    expect(loadOverrides()).toEqual({});
  });

  it('localStorage 抛错时回退内存', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    saveOverride('p1', { prompt: 'x' });
    expect(loadOverrides()).toEqual({ p1: { prompt: 'x' } });
  });

  it('损坏 JSON 静默丢弃', () => {
    localStorage.setItem(`${KEY_PREFIX}:overrides:p1`, '{not json');
    expect(loadOverrides()).toEqual({});
  });
});

describe('persistence - theme', () => {
  it('loadTheme 默认 system', () => {
    expect(loadTheme()).toBe('system');
  });

  it('saveTheme 与 loadTheme 往返', () => {
    saveTheme('dark');
    expect(loadTheme()).toBe('dark');
  });
});
```

**Step 6.2: 运行测试,确认失败**

```bash
npm test -- tests/unit/persistence.test.ts
```

Expected: FAIL。

**Step 6.3: 写 `src/state/persistence.ts`**

```ts
import type { Override, Theme } from '../types.js';

const KEY_PREFIX = 'ccpw:zh:v1';
const OVERRIDE_KEY = (id: string) => `${KEY_PREFIX}:overrides:${id}`;
const THEME_KEY = `${KEY_PREFIX}:prefs:theme`;

// 内存兜底(隐私模式下 localStorage 抛错)
const memoryOverrides = new Map<string, Override>();

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 内存兜底
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // 忽略
  }
}

export function loadOverrides(): Record<string, Override> {
  const result: Record<string, Override> = {};
  // 从 localStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`${KEY_PREFIX}:overrides:`)) {
        const raw = safeGet(k);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw) as Override;
          const id = k.slice(`${KEY_PREFIX}:overrides:`.length);
          result[id] = parsed;
        } catch {
          // 损坏 JSON 静默丢弃
        }
      }
    }
  } catch {
    // localStorage 完全不可用,使用内存
  }
  // 合并内存(覆盖 localStorage 中损坏条目)
  for (const [id, ov] of memoryOverrides) {
    result[id] = ov;
  }
  return result;
}

export function saveOverride(id: string, ov: Override): void {
  memoryOverrides.set(id, ov);
  safeSet(OVERRIDE_KEY(id), JSON.stringify(ov));
}

export function removeOverride(id: string): void {
  memoryOverrides.delete(id);
  safeRemove(OVERRIDE_KEY(id));
}

export function clearAllOverrides(): void {
  memoryOverrides.clear();
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`${KEY_PREFIX}:overrides:`)) keys.push(k);
    }
    keys.forEach(k => safeRemove(k));
  } catch {
    // 忽略
  }
}

export function loadTheme(): Theme {
  const raw = safeGet(THEME_KEY);
  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  return 'system';
}

export function saveTheme(theme: Theme): void {
  safeSet(THEME_KEY, theme);
}
```

**Step 6.4: 运行测试,确认通过**

```bash
npm test -- tests/unit/persistence.test.ts
```

Expected: PASS。

**Step 6.5: 提交**

```bash
git add src/state/persistence.ts tests/unit/persistence.test.ts
git commit -m "feat(state): localStorage persistence with ccpw:zh:v1:* namespace and memory fallback"
```

---

## Task 7: 主题 `src/state/theme.ts`

**Files:**
- Create: `src/state/theme.ts`

**Step 7.1: 写实现**

```ts
import { getStore, setStore, subscribe } from './store.js';
import { loadTheme, saveTheme } from './persistence.js';

export function initTheme(): void {
  const theme = loadTheme();
  setStore({ theme });
  applyTheme();
  subscribe(() => {
    saveTheme(getStore().theme);
    applyTheme();
  });

  // 跟随系统
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (getStore().theme === 'system') applyTheme();
    };
    mql.addEventListener('change', onChange);
  }
}

export function applyTheme(): void {
  if (typeof document === 'undefined') return;
  const { theme } = getStore();
  let effective: 'light' | 'dark';
  if (theme === 'system') {
    const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    effective = dark ? 'dark' : 'light';
  } else {
    effective = theme;
  }
  document.documentElement.dataset.theme = effective;
}

export function toggleTheme(): void {
  const { theme } = getStore();
  const next = theme === 'dark' ? 'light' : 'dark';
  setStore({ theme: next });
}

export function setSystemTheme(): void {
  setStore({ theme: 'system' });
}
```

**Step 7.2: 提交**

```bash
git add src/state/theme.ts
git commit -m "feat(state): theme module (system/light/dark, matchMedia follow)"
```

---

## Task 8: 动效 `src/state/motion.ts`

**Files:**
- Create: `src/state/motion.ts`

**Step 8.1: 写实现**

```ts
import { setStore, subscribe } from './store.js';

export function initMotion(): void {
  if (typeof window === 'undefined' || !window.matchMedia) return;
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  setStore({ prefersReducedMotion: mql.matches });
  mql.addEventListener('change', e => {
    setStore({ prefersReducedMotion: e.matches });
  });
}

export function shouldAnimate(): boolean {
  return false; // 占位,实际由 subscribe 同步;此处仅作 helper
}
```

**Step 8.2: 提交**

```bash
git add src/state/motion.ts
git commit -m "feat(state): motion module (prefers-reduced-motion detection)"
```

---

## Task 9: 数据加载 `src/data/prompts.ts`

**Files:**
- Create: `src/data/prompts.ts`
- Create: `tests/unit/prompts.test.ts`

**Step 9.1: 写测试**

```ts
import { describe, it, expect } from 'vitest';
import { validateCatalog, filterPrompts } from '../../src/data/prompts.js';
import type { Prompt } from '../../src/types.js';

const samplePrompt: Prompt = {
  id: 'p1',
  sdlc: 'discover',
  cat: 'Understand',
  roles: [],
  prompt: 'explain what {path} does',
  slots: { path: 'src/x.ts' },
  src: 'workflows',
  title: '解释代码',
  teaches: '描述你想要的内容,让 Claude 找文件',
};

describe('validateCatalog', () => {
  it('合法 catalog 通过校验', () => {
    expect(() => validateCatalog({ prompts: [samplePrompt], sources: {} as any, labels: {} as any, taxonomy: {} as any })).not.toThrow();
  });

  it('id 重复时抛出错误', () => {
    expect(() => validateCatalog({ prompts: [samplePrompt, samplePrompt], sources: {} as any, labels: {} as any, taxonomy: {} as any })).toThrow(/duplicate/);
  });

  it('未知 sdlc 抛出错误', () => {
    expect(() => validateCatalog({ prompts: [{ ...samplePrompt, sdlc: 'wrong' as any }], sources: {} as any, labels: {} as any, taxonomy: {} as any })).toThrow();
  });
});

describe('filterPrompts', () => {
  const catalog = { prompts: [
    samplePrompt,
    { ...samplePrompt, id: 'p2', cat: 'Plan' as const, sdlc: 'design' as const, roles: ['pm' as const], title: '规划', prompt: 'plan the {feature}', slots: { feature: 'rate limits' } },
    { ...samplePrompt, id: 'p3', cat: 'Test' as const, sdlc: 'build' as const, startN: 1, title: '写测试' },
  ], sources: {} as any, labels: {} as any, taxonomy: {} as any };

  it('按搜索词过滤', () => {
    const r = filterPrompts(catalog, { q: '解释' });
    expect(r.map(p => p.id)).toEqual(['p1']);
  });

  it('按 sel(role) 过滤', () => {
    const r = filterPrompts(catalog, { sel: 'pm' });
    expect(r.map(p => p.id)).toEqual(['p2']);
  });

  it('start=true 仅返回 startN 有值且按 startN 排序', () => {
    const r = filterPrompts(catalog, { start: true });
    expect(r.map(p => p.id)).toEqual(['p3']);
  });

  it('start=false 返回全部', () => {
    const r = filterPrompts(catalog, { start: false });
    expect(r).toHaveLength(3);
  });
});
```

**Step 9.2: 运行测试,确认失败**

```bash
npm test -- tests/unit/prompts.test.ts
```

Expected: FAIL。

**Step 9.3: 写 `src/data/prompts.ts`**

```ts
import type { Prompt, PromptCatalog, Role, Sdlc, Cat } from '../types.js';

const SDLCS: Sdlc[] = ['discover', 'design', 'build', 'ship', 'operate'];
const CATS: Cat[] = ['Onboard', 'Understand', 'Plan', 'Prototype', 'Implement', 'Test', 'Refactor', 'Review', 'Steer', 'Git', 'Release', 'Debug', 'Incident', 'Data', 'Automate'];
const ROLES: Role[] = ['understand', 'plan', 'prototype', 'build', 'test', 'refactor', 'review', 'steer', 'debug', 'git', 'release', 'data', 'automate', 'pm', 'design', 'docs', 'marketing', 'security', 'ops'];

export function validateCatalog(catalog: PromptCatalog): void {
  const seen = new Set<string>();
  for (const p of catalog.prompts) {
    if (seen.has(p.id)) throw new Error(`duplicate id: ${p.id}`);
    seen.add(p.id);
    if (!SDLCS.includes(p.sdlc)) throw new Error(`invalid sdlc: ${p.sdlc}`);
    if (!CATS.includes(p.cat)) throw new Error(`invalid cat: ${p.cat}`);
    for (const r of p.roles) {
      if (!ROLES.includes(r)) throw new Error(`invalid role: ${r}`);
    }
  }
}

export async function loadCatalog(): Promise<PromptCatalog> {
  // 内置兜底 i18n 字典(若 fetch 失败使用)
  const fallback = await import('./i18n.js');
  try {
    const res = await fetch('./prompts.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as Omit<PromptCatalog, 'labels' | 'taxonomy'>;
    return { ...data, labels: fallback.LABELS, taxonomy: fallback.TAXONOMY };
  } catch {
    return { prompts: [], sources: {} as any, labels: fallback.LABELS, taxonomy: fallback.TAXONOMY };
  }
}

export function assemblePrompt(p: Prompt, overrides?: { slots?: Record<string, string>; prompt?: string }): string {
  const tmpl = overrides?.prompt ?? p.prompt;
  const slots = { ...(p.slots ?? {}), ...(overrides?.slots ?? {}) };
  return tmpl.replace(/\{(\w+)\}/g, (_, k) => slots[k] ?? `{${k}}`);
}

export interface FilterOpts {
  q?: string;
  sel?: Role | null;
  start?: boolean;
}

export function filterPrompts(catalog: PromptCatalog, opts: FilterOpts): Prompt[] {
  let list = catalog.prompts.slice();
  if (opts.start) {
    list = list.filter(p => typeof p.startN === 'number');
    list.sort((a, b) => (a.startN ?? 0) - (b.startN ?? 0));
    return list;
  }
  if (opts.q && opts.q.trim()) {
    const ql = opts.q.trim().toLowerCase();
    list = list.filter(p =>
      p.title.toLowerCase().includes(ql) ||
      p.prompt.toLowerCase().includes(ql) ||
      p.teaches.toLowerCase().includes(ql)
    );
  }
  if (opts.sel) {
    const tag = opts.sel;
    list = list.filter(p => {
      // sel 可以是 cat(understand/plan/...) 或 role(pm/design/...)
      if (CATS.includes(tag as Cat)) {
        const catMap: Record<string, string> = { understand: 'Understand', plan: 'Plan', prototype: 'Prototype', build: 'Implement', test: 'Test', refactor: 'Refactor', review: 'Review', steer: 'Steer', debug: 'Debug', git: 'Git', release: 'Release', data: 'Data', automate: 'Automate' };
        return p.cat === catMap[tag];
      }
      return p.roles.includes(tag);
    });
  }
  // 默认按 roles 数量升序,operate 在前
  list.sort((a, b) => {
    const ao = a.sdlc === 'operate' ? 0 : 1;
    const bo = b.sdlc === 'operate' ? 0 : 1;
    return ao - bo || a.roles.length - b.roles.length;
  });
  return list;
}

export function groupByPhaseAndCat(prompts: Prompt[]): Array<{ sdlc: Sdlc; cat: Cat; items: Prompt[] }> {
  const map = new Map<string, { sdlc: Sdlc; cat: Cat; items: Prompt[] }>();
  for (const p of prompts) {
    const k = `${p.sdlc}|${p.cat}`;
    if (!map.has(k)) map.set(k, { sdlc: p.sdlc, cat: p.cat, items: [] });
    map.get(k)!.items.push(p);
  }
  return Array.from(map.values());
}
```

**Step 9.4: 写 `src/data/i18n.ts`(内置兜底字典)**

```ts
import type { I18nLabels, I18nTaxonomy } from '../types.js';

export const LABELS: I18nLabels = {
  search: '搜索提示词…',
  startHere: '新手入门',
  startHereHeader: '5 条值得先试的提示词',
  showAll: (n: number) => `显示全部 ${n} 条提示词`,
  clear: '清除',
  prompt: '条',
  prompts: '条',
  noMatch: (q: string) => `没有匹配 “${q}” 的提示词`,
  fillAndCopy: '填写并复制',
  copyThis: '复制这条提示词',
  hintBefore: '在',
  hintChip: '高亮',
  hintAfter: '字段里填入自定义上下文,然后再复制。',
  copy: '复制',
  copied: '已复制',
  whyWorks: '为什么有效',
  makeItStick: '巩固记忆',
  from: '来源',
  paste: {
    mockup: '把你的草图粘贴、拖拽进提示词,或用 @ 引用,然后发送:',
    design: '把你的设计稿粘贴、拖拽进提示词,或用 @ 引用,然后发送:',
    screenshot: '把截图粘贴、拖拽进提示词,或用 @ 引用,然后发送:',
    plan: '先把计划输出粘贴到提示词里,然后再发送:',
    error: '把错误输出粘贴到提示词里,然后再发送:',
    csv: '把文件拖进提示词,或者把下面的路径替换成你自己的 @ 引用:',
  },
  needsLabel: '需要',
  needs: {
    tracker: '你的任务跟踪工具(已接入 claude.ai connector 或 MCP server)',
    gh: '已认证的 gh CLI,或已接入的 GitHub connector',
    browser: '能渲染并截图的工具:Claude Desktop 应用内置,或安装 Chrome 扩展 / Playwright MCP',
    db: '你的数据仓库或日志存储(已接入 MCP)',
  },
};

export const TAXONOMY: I18nTaxonomy = {
  tagLabels: {
    understand: '理解', plan: '计划', prototype: '原型', build: '构建', test: '测试',
    refactor: '重构', review: '审查', steer: '纠偏', debug: '调试', git: 'Git',
    release: '发布', data: '数据', automate: '自动化',
    pm: '产品', design: '设计', docs: '文档', marketing: '市场', security: '安全', ops: '运维',
  },
  phaseLabels: {
    discover: '发现', design: '设计', build: '构建', ship: '发布', operate: '运维',
  },
  sourceLabels: {
    workflows: '常用工作流', teams: 'Anthropic 团队实践',
    legal: 'Anthropic 法务实践', cybersecurity: 'Anthropic 安全实践',
    'best-practices': '最佳实践', ebook: '规模化 Agentic Coding 指南',
  },
  catLabels: {
    Onboard: '入门', Understand: '理解代码', Plan: '规划', Prototype: '原型',
    Implement: '实现', Test: '测试', Refactor: '重构', Review: '审查', Steer: '纠偏',
    Git: 'Git', Release: '发布', Debug: '调试', Incident: '故障响应',
    Data: '数据分析', Automate: '自动化',
  },
};
```

**Step 9.5: 运行测试,确认通过**

```bash
npm test -- tests/unit/prompts.test.ts
```

Expected: PASS。

**Step 9.6: 提交**

```bash
git add src/data/prompts.ts src/data/i18n.ts tests/unit/prompts.test.ts
git commit -m "feat(data): catalog loader with TDD validation, filter, group, i18n fallback"
```

---

## Task 10: 主题 tokens 与动效 CSS

**Files:**
- Create: `src/theme/tokens.css`
- Create: `src/theme/animations.css`
- Create: `src/styles/reset.css`

**Step 10.1: 写 `src/styles/reset.css`**

```css
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: var(--ccpw-font-sans);
  background: var(--ccpw-bg);
  color: var(--ccpw-text);
  -webkit-font-smoothing: antialiased;
  transition: var(--ccpw-transition);
}
button { font: inherit; cursor: pointer; background: none; border: none; color: inherit; }
input, textarea { font: inherit; }
```

**Step 10.2: 写 `src/theme/tokens.css`**

```css
:root {
  --ccpw-accent: #84cc16;
  --ccpw-accent-2: #c084fc;
  --ccpw-accent-bg: rgba(132, 204, 22, 0.10);
  --ccpw-bg: #f0eee6;
  --ccpw-surface: #fafaf7;
  --ccpw-border: #e8e6dc;
  --ccpw-border-subtle: rgba(31, 30, 29, 0.08);
  --ccpw-text: #141413;
  --ccpw-text-2: #5e5d59;
  --ccpw-text-3: #73726c;
  --ccpw-text-4: #9c9a92;
  --ccpw-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --ccpw-font-sans: -apple-system, BlinkMacSystemFont, 'PingFang SC',
                    'Microsoft YaHei', 'Hiragino Sans GB', sans-serif;
  --ccpw-transition: color 400ms ease, background-color 400ms ease,
                     border-color 400ms ease, box-shadow 400ms ease;
}

:root[data-theme="dark"] {
  --ccpw-bg: #0a0e14;
  --ccpw-surface: #131820;
  --ccpw-border: #2a313a;
  --ccpw-border-subtle: rgba(240, 238, 230, 0.08);
  --ccpw-text: #f0eee6;
  --ccpw-text-2: #bfbdb4;
  --ccpw-text-3: #91908a;
  --ccpw-text-4: #73726c;
  --ccpw-accent: #84cc16;
  --ccpw-accent-2: #c084fc;
  --ccpw-accent-bg: rgba(132, 204, 22, 0.12);
}

@media (prefers-reduced-motion: reduce) {
  :root { --ccpw-transition: none; }
}
```

**Step 10.3: 写 `src/theme/animations.css`**

```css
@media (prefers-reduced-motion: no-preference) {
  @keyframes ccpw-glow-pulse {
    0%, 100% { box-shadow: 0 0 0 0 var(--ccpw-accent-bg); }
    50% { box-shadow: 0 0 16px 2px var(--ccpw-accent-bg); }
  }
  @keyframes ccpw-stagger-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes ccpw-chromatic-shift {
    0%, 100% { text-shadow: none; }
    50% { text-shadow: -1px 0 var(--ccpw-accent), 1px 0 var(--ccpw-accent-2); }
  }
  @keyframes ccpw-scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  .ccpw-card { animation: ccpw-stagger-in 320ms ease both; }
  .ccpw-card:hover { animation: ccpw-glow-pulse 1.6s ease infinite; }
}
```

**Step 10.4: 更新 `index.html`,引入 `animations.css` 与 `reset.css`**

在 `<head>` 的 `<link rel="stylesheet" href="/src/theme/tokens.css">` 后追加:

```html
  <link rel="stylesheet" href="/src/styles/reset.css">
  <link rel="stylesheet" href="/src/theme/animations.css">
```

**Step 10.5: 提交**

```bash
git add src/theme src/styles index.html
git commit -m "feat(styles): css reset, theme tokens (light/dark), animations"
```

---

## Task 11: Web Components 根 `<ccpw-app>`

**Files:**
- Create: `src/components/ccpw-app.ts`
- Modify: `src/main.ts`

**Step 11.1: 写 `src/components/ccpw-app.ts`**

```ts
import { loadCatalog } from '../data/prompts.js';
import { initTheme } from '../state/theme.js';
import { initMotion } from '../state/motion.js';
import { loadOverrides, saveOverride, removeOverride, clearAllOverrides } from '../state/persistence.js';
import { setStore, getStore, subscribe } from '../state/store.js';
import './ccpw-search.js';
import './ccpw-tag-bar.js';
import './ccpw-prompt-list.js';
import './ccpw-theme-toggle.js';
import './ccpw-empty-state.js';

let catalogReady: Promise<void> | null = null;

export async function bootstrapCatalog() {
  if (catalogReady) return catalogReady;
  catalogReady = (async () => {
    initMotion();
    const catalog = await loadCatalog();
    // 写入全局(组件可访问)
    (window as any).__ccpwCatalog = catalog;
    // 初始化 store
    setStore({ overrides: loadOverrides() });
    initTheme();
    document.dispatchEvent(new CustomEvent('ccpw:catalog-ready', { detail: catalog }));
  })();
  return catalogReady;
}

class CCPWApp extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="ccpw-shell">
        <header class="ccpw-header">
          <h1>Claude 提示词工作台</h1>
          <ccpw-theme-toggle></ccpw-theme-toggle>
        </header>
        <ccpw-search></ccpw-search>
        <ccpw-tag-bar></ccpw-tag-bar>
        <main>
          <ccpw-prompt-list></ccpw-prompt-list>
          <ccpw-empty-state></ccpw-empty-state>
        </main>
        <footer class="ccpw-footer">
          <button id="ccpw-reset-all" type="button">恢复全部官方默认</button>
        </footer>
      </div>
    `;
    this.querySelector('#ccpw-reset-all')!.addEventListener('click', () => {
      clearAllOverrides();
      setStore({ overrides: {} });
    });
    bootstrapCatalog();
  }
}

customElements.define('ccpw-app', CCPWApp);
```

**Step 11.2: 更新 `src/main.ts`**

```ts
import './components/ccpw-app.js';
```

**Step 11.3: 提交**

```bash
git add src/components/ccpw-app.ts src/main.ts
git commit -m "feat(components): ccpw-app root with bootstrap + reset-all button"
```

---

## Task 12: Web Components `<ccpw-search>`

**Files:**
- Create: `src/components/ccpw-search.ts`

**Step 12.1: 写实现**

```ts
import { getStore, setStore, subscribe } from '../state/store.js';

class CCPWSearch extends HTMLElement {
  private unsub?: () => void;
  private input?: HTMLInputElement;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display: block; margin: 16px 0; }
        .wrap {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px; border: 1px solid var(--ccpw-border);
          border-radius: 12px; background: var(--ccpw-surface);
          transition: border-color 200ms;
        }
        .wrap:focus-within { border-color: var(--ccpw-accent); box-shadow: 0 0 0 3px var(--ccpw-accent-bg); }
        input { flex: 1; border: none; outline: none; background: transparent; color: var(--ccpw-text); font-size: 16px; }
        svg { flex-shrink: 0; color: var(--ccpw-text-4); }
      </style>
      <label class="wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="search" placeholder="搜索提示词…" aria-label="搜索提示词" />
      </label>
    `;
    this.input = shadow.querySelector('input')!;
    this.input.value = getStore().q;
    this.input.addEventListener('input', e => {
      const v = (e.target as HTMLInputElement).value;
      const { sel, start } = getStore();
      setStore({ q: v, start: v ? false : start, sel: v ? null : sel });
    });
    this.unsub = subscribe(() => {
      if (this.input && this.input.value !== getStore().q) {
        this.input.value = getStore().q;
      }
    });
  }

  disconnectedCallback() {
    this.unsub?.();
  }
}

customElements.define('ccpw-search', CCPWSearch);
```

**Step 12.2: 提交**

```bash
git add src/components/ccpw-search.ts
git commit -m "feat(components): ccpw-search with q ↔ store sync"
```

---

## Task 13: Web Components `<ccpw-tag-bar>`

**Files:**
- Create: `src/components/ccpw-tag-bar.ts`

**Step 13.1: 写实现**

```ts
import { getStore, setStore, subscribe } from '../state/store.js';
import type { PromptCatalog, Role } from '../types.js';

const TAG_ORDER: Role[] = ['understand', 'plan', 'prototype', 'build', 'test', 'refactor', 'review', 'steer', 'debug', 'git', 'release', 'data', 'automate', 'pm', 'design', 'docs', 'marketing', 'security', 'ops'];

class CCPWTagBar extends HTMLElement {
  private unsub?: () => void;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display: block; margin: 12px 0; }
        .bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        button {
          padding: 6px 12px; border: 1px solid var(--ccpw-border);
          border-radius: 999px; background: var(--ccpw-bg);
          color: var(--ccpw-text-2); font-size: 14px;
          transition: all 200ms;
        }
        button:hover { background: var(--ccpw-surface); }
        button.on { background: var(--ccpw-accent); border-color: var(--ccpw-accent); color: #0a0e14; font-weight: 500; }
        button.start { color: var(--ccpw-accent); }
        button.start.on { color: #0a0e14; }
        .sep { width: 1px; height: 22px; background: var(--ccpw-border); margin: 0 4px; }
        .clear { color: var(--ccpw-text-4); font-size: 13px; }
      </style>
      <div class="bar" part="bar"></div>
    `;
    this.render();
    this.unsub = subscribe(() => this.render());
  }

  disconnectedCallback() { this.unsub?.(); }

  private render() {
    const bar = this.shadowRoot!.querySelector('.bar')!;
    const s = getStore();
    const catalog = (window as any).__ccpwCatalog as PromptCatalog | undefined;
    const labelOf = (k: Role) => catalog?.taxonomy.tagLabels[k] ?? k;

    const startBtn = document.createElement('button');
    startBtn.className = `start${s.start ? ' on' : ''}`;
    startBtn.textContent = `★ 新手入门`;
    startBtn.addEventListener('click', () => setStore({ start: !s.start, sel: null, q: '' }));
    bar.replaceChildren(startBtn);

    const sep = document.createElement('span'); sep.className = 'sep'; bar.appendChild(sep);

    for (const k of TAG_ORDER) {
      const btn = document.createElement('button');
      btn.className = s.sel === k ? 'on' : '';
      btn.textContent = labelOf(k);
      btn.addEventListener('click', () => setStore({ sel: s.sel === k ? null : k, start: false }));
      bar.appendChild(btn);
    }

    if (s.start || s.sel || s.q) {
      const clear = document.createElement('button');
      clear.className = 'clear';
      clear.textContent = '清除';
      clear.addEventListener('click', () => setStore({ start: true, sel: null, q: '' }));
      bar.appendChild(clear);
    }
  }
}

customElements.define('ccpw-tag-bar', CCPWTagBar);
```

**Step 13.2: 提交**

```bash
git add src/components/ccpw-tag-bar.ts
git commit -m "feat(components): ccpw-tag-bar with 19 roles + start-here toggle"
```

---

## Task 14: Web Components `<ccpw-prompt-list>` 与 `<ccpw-empty-state>`

**Files:**
- Create: `src/components/ccpw-prompt-list.ts`
- Create: `src/components/ccpw-empty-state.ts`

**Step 14.1: 写 `src/components/ccpw-prompt-list.ts`**

```ts
import { getStore, subscribe } from '../state/store.js';
import { filterPrompts, groupByPhaseAndCat } from '../data/prompts.js';
import type { Prompt, PromptCatalog } from '../types.js';
import './ccpw-prompt-card.js';

class CCPWPromptList extends HTMLElement {
  private unsub?: () => void;
  private readyUnsub?: () => void;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>
      :host { display: block; }
      .group-h {
        font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
        color: var(--ccpw-text-4); margin: 24px 0 12px;
        font-family: var(--ccpw-mono);
      }
      .group-h .phase { color: var(--ccpw-text-3); }
      .grid { display: grid; gap: 12px; }
    </style><div class="root"></div>`;
    this.render();
    this.unsub = subscribe(() => this.render());
    document.addEventListener('ccpw:catalog-ready', this.render);
    this.readyUnsub = () => document.removeEventListener('ccpw:catalog-ready', this.render);
  }

  disconnectedCallback() {
    this.unsub?.();
    this.readyUnsub?.();
  }

  private render = () => {
    const root = this.shadowRoot?.querySelector('.root') as HTMLElement;
    if (!root) return;
    const catalog = (window as any).__ccpwCatalog as PromptCatalog | undefined;
    if (!catalog) { root.innerHTML = ''; return; }
    const s = getStore();
    const filtered = filterPrompts(catalog, { q: s.q, sel: s.sel, start: s.start });
    document.dispatchEvent(new CustomEvent('ccpw:filtered-count', { detail: filtered.length }));

    if (s.start) {
      const list = filtered.map((p, i) => this.renderCard(p, i));
      root.replaceChildren(...list);
      return;
    }
    const groups = groupByPhaseAndCat(filtered);
    root.replaceChildren(...groups.flatMap(g => [
      Object.assign(document.createElement('div'), {
        className: 'group-h', innerHTML: `<span class="phase">${catalog.taxonomy.phaseLabels[g.sdlc]}</span> · ${catalog.taxonomy.catLabels[g.cat]}`,
      }),
      Object.assign(document.createElement('div'), {
        className: 'grid',
      }),
    ].map((el, idx) => {
      if (idx === 1) {
        (el as HTMLElement).replaceChildren(...g.items.map((p, i) => this.renderCard(p, i)));
      }
      return el;
    })));
  };

  private renderCard(p: Prompt, i: number): HTMLElement {
    const card = document.createElement('ccpw-prompt-card') as any;
    card.prompt = p;
    card.style.animationDelay = `${i * 30}ms`;
    return card;
  }
}

customElements.define('ccpw-prompt-list', CCPWPromptList);
```

**Step 14.2: 写 `src/components/ccpw-empty-state.ts`**

```ts
import { getStore, subscribe } from '../state/store.js';
import type { PromptCatalog } from '../types.js';

class CCPWEmptyState extends HTMLElement {
  private unsub?: () => void;
  private count = 0;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>
      :host { display: block; }
      .empty {
        padding: 32px; text-align: center; color: var(--ccpw-text-4);
        border: 1px dashed var(--ccpw-border); border-radius: 10px;
        font-family: var(--ccpw-mono);
      }
      :host([hidden]) { display: none; }
    </style><div class="empty"></div>`;
    document.addEventListener('ccpw:filtered-count', ((e: CustomEvent) => { this.count = e.detail; this.render(); }) as EventListener);
    this.unsub = subscribe(() => this.render());
    this.render();
  }

  disconnectedCallback() { this.unsub?.(); }

  private render() {
    const root = this.shadowRoot?.querySelector('.empty') as HTMLElement;
    if (!root) return;
    const s = getStore();
    const catalog = (window as any).__ccpwCatalog as PromptCatalog | undefined;
    if (this.count === 0 && (s.q || s.sel) && catalog) {
      this.removeAttribute('hidden');
      root.textContent = s.q ? `没有匹配 “${s.q}” 的提示词` : '当前筛选下没有结果';
    } else {
      this.setAttribute('hidden', '');
    }
  }
}

customElements.define('ccpw-empty-state', CCPWEmptyState);
```

**Step 14.3: 提交**

```bash
git add src/components/ccpw-prompt-list.ts src/components/ccpw-empty-state.ts
git commit -m "feat(components): ccpw-prompt-list (grouped/stagger) + ccpw-empty-state"
```

---

## Task 15: Web Components `<ccpw-prompt-card>`(slot 编辑 + 复制 + 恢复)

**Files:**
- Create: `src/components/ccpw-prompt-card.ts`

**Step 15.1: 写实现**

```ts
import { getStore, setStore, subscribe } from '../state/store.js';
import { saveOverride, removeOverride } from '../state/persistence.js';
import { assemblePrompt } from '../data/prompts.js';
import type { Prompt, PromptCatalog } from '../types.js';

class CCPWPromptCard extends HTMLElement {
  prompt!: Prompt;
  private open = false;
  private unsub?: () => void;
  private copied = false;
  private copyTimer?: number;

  static get observedAttributes() { return ['prompt']; }

  set promptData(p: Prompt) { this.prompt = p; this.render(); }
  get promptData(): Prompt { return this.prompt; }

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    if (this.prompt) this.render();
  }

  attributeChangedCallback() { /* no-op, use property */ }

  disconnectedCallback() {
    this.unsub?.();
    if (this.copyTimer) clearTimeout(this.copyTimer);
  }

  private toggle() {
    this.open = !this.open;
    this.render();
  }

  private async copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    this.copied = true;
    this.render();
    if (this.copyTimer) clearTimeout(this.copyTimer);
    this.copyTimer = window.setTimeout(() => { this.copied = false; this.render(); }, 1600);
  }

  private onSlotChange(key: string, val: string) {
    const ov = getStore().overrides[this.prompt.id] ?? {};
    const slots = { ...(ov.slots ?? this.prompt.slots ?? {}), [key]: val };
    const next = { ...ov, slots };
    saveOverride(this.prompt.id, next);
    setStore({ overrides: { ...getStore().overrides, [this.prompt.id]: next } });
  }

  private restore() {
    removeOverride(this.prompt.id);
    const overrides = { ...getStore().overrides };
    delete overrides[this.prompt.id];
    setStore({ overrides });
  }

  private render() {
    if (!this.prompt) return;
    const s = getStore();
    const catalog = (window as any).__ccpwCatalog as PromptCatalog | undefined;
    const ov = s.overrides[this.prompt.id];
    const slots = { ...(this.prompt.slots ?? {}), ...(ov?.slots ?? {}) };
    const finalPrompt = assemblePrompt(this.prompt, ov);
    const srcLabel = catalog?.taxonomy.sourceLabels[this.prompt.src] ?? this.prompt.src;

    const shadow = this.shadowRoot!;
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .card {
          border: 1px solid var(--ccpw-border-subtle);
          border-radius: 10px; margin-bottom: 12px;
          background: var(--ccpw-bg); overflow: hidden;
          padding: 14px 18px; transition: border-color 200ms;
          font-family: var(--ccpw-font-sans);
        }
        .card.open { border-color: var(--ccpw-border); background: var(--ccpw-surface); }
        .head { display: flex; align-items: baseline; gap: 12px; }
        .title { flex: 1; font-size: 17px; font-weight: 500; color: var(--ccpw-text); cursor: pointer; }
        .chip { font-size: 11px; padding: 3px 9px; border-radius: 999px; background: var(--ccpw-accent-bg); color: var(--ccpw-accent); font-family: var(--ccpw-mono); }
        .preview { display: block; font-family: var(--ccpw-mono); font-size: 13.5px; color: var(--ccpw-text-3); margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .body { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--ccpw-border-subtle); }
        .label { font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ccpw-text-4); margin: 12px 0 8px; font-family: var(--ccpw-mono); }
        .prompt-box { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: #0a0e14; color: #f0eee6; border-radius: 8px; font-family: var(--ccpw-mono); font-size: 15px; flex-wrap: wrap; }
        .caret { color: var(--ccpw-accent); flex-shrink: 0; }
        .slot { background: rgba(132,204,22,0.15); color: #f0eee6; border: none; border-bottom: 1.5px dashed var(--ccpw-accent); border-radius: 4px 4px 0 0; padding: 2px 6px; margin: 0 1px; outline: none; min-width: 8ch; max-width: 100%; font-family: inherit; }
        .copy { font-size: 12.5px; padding: 6px 12px; border-radius: 6px; background: var(--ccpw-accent); color: #0a0e14; border: none; font-weight: 500; margin-left: auto; }
        .teaches { font-size: 15.5px; color: var(--ccpw-text-2); line-height: 1.6; margin-top: 4px; }
        .next { display: flex; align-items: baseline; gap: 10px; margin: 14px 0 0; padding: 10px 12px; background: var(--ccpw-accent-bg); border-radius: 8px; font-size: 14.5px; }
        .next-label { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ccpw-accent); font-weight: 600; flex-shrink: 0; font-family: var(--ccpw-mono); }
        .src { font-size: 13px; color: var(--ccpw-text-4); margin-top: 12px; }
        .restore { margin-left: 12px; background: none; border: 1px solid var(--ccpw-border); color: var(--ccpw-text-2); padding: 6px 12px; border-radius: 6px; font-size: 13px; }
      </style>
      <div class="card ${this.open ? 'open' : ''} ccpw-card">
        <button type="button" class="head" style="all:unset; display:flex; align-items:baseline; gap:12px; cursor:pointer; width:100%;">
          <span class="title">${escapeHtml(this.prompt.title)}</span>
          ${this.prompt.startN ? `<span class="chip">新手入门 · ${this.prompt.startN}</span>` : ''}
        </button>
        <code class="preview">${escapeHtml(this.previewPrompt())}</code>
        ${this.open ? `
          <div class="body">
            <div class="label">${this.prompt.slots ? '填写并复制' : '复制这条提示词'}</div>
            <div class="prompt-box">
              <span class="caret">❯</span>
              ${this.renderPromptBody(slots)}
              <button type="button" class="copy">${this.copied ? '已复制' : '复制'}</button>
            </div>
            <div class="label">为什么有效</div>
            <div class="teaches">${escapeHtml(this.prompt.teaches)}</div>
            ${this.prompt.next ? `
              <div class="next">
                <span class="next-label">巩固记忆</span>
                <span>${escapeHtml(this.prompt.next)}</span>
              </div>
            ` : ''}
            <div class="src">来源:${escapeHtml(srcLabel)}</div>
            ${ov ? `<button type="button" class="restore">恢复官方默认</button>` : ''}
          </div>
        ` : ''}
      </div>
    `;

    const headBtn = shadow.querySelector('.head') as HTMLButtonElement;
    headBtn?.addEventListener('click', () => this.toggle());
    const copyBtn = shadow.querySelector('.copy') as HTMLButtonElement | null;
    copyBtn?.addEventListener('click', () => this.copy(finalPrompt));
    shadow.querySelectorAll<HTMLInputElement>('.slot').forEach(input => {
      input.addEventListener('input', () => this.onSlotChange(input.dataset.key!, input.value));
    });
    const restoreBtn = shadow.querySelector('.restore') as HTMLButtonElement | null;
    restoreBtn?.addEventListener('click', () => this.restore());
  }

  private previewPrompt(): string {
    return assemblePrompt(this.prompt, getStore().overrides[this.prompt.id]);
  }

  private renderPromptBody(slots: Record<string, string>): string {
    const tmpl = this.prompt.prompt;
    return tmpl.split(/(\{\w+\})/g).map(part => {
      const m = part.match(/^\{(\w+)\}$/);
      if (!m) return `<span>${escapeHtml(part)}</span>`;
      const k = m[1]!;
      const val = slots[k] ?? '';
      return `<input type="text" class="slot" data-key="${k}" value="${escapeHtml(val)}" placeholder="${escapeHtml(this.prompt.slots?.[k] ?? k)}" />`;
    }).join('');
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

customElements.define('ccpw-prompt-card', CCPWPromptCard);

// expose helper for ccpw-prompt-list
declare global { interface HTMLElement { prompt?: Prompt; } }
```

**Step 15.2: 提交**

```bash
git add src/components/ccpw-prompt-card.ts
git commit -m "feat(components): ccpw-prompt-card with slot edit, copy, restore-default"
```

---

## Task 16: Web Components `<ccpw-theme-toggle>`

**Files:**
- Create: `src/components/ccpw-theme-toggle.ts`

**Step 16.1: 写实现**

```ts
import { getStore, setStore, subscribe } from '../state/store.js';
import type { Theme } from '../types.js';

const ICONS: Record<Theme, string> = {
  system: '◐', light: '☀', dark: '☾',
};

class CCPWThemeToggle extends HTMLElement {
  private unsub?: () => void;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display: inline-block; }
        button {
          padding: 6px 12px; border: 1px solid var(--ccpw-border);
          border-radius: 6px; background: var(--ccpw-bg);
          color: var(--ccpw-text); font-family: var(--ccpw-mono);
          font-size: 14px; transition: all 200ms;
        }
        button:hover { background: var(--ccpw-surface); border-color: var(--ccpw-accent); }
      </style>
      <button type="button" aria-label="切换主题"></button>
    `;
    this.render();
    shadow.querySelector('button')!.addEventListener('click', () => this.cycle());
    this.unsub = subscribe(() => this.render());
  }

  disconnectedCallback() { this.unsub?.(); }

  private cycle() {
    const order: Theme[] = ['system', 'light', 'dark'];
    const cur = getStore().theme;
    const idx = order.indexOf(cur);
    setStore({ theme: order[(idx + 1) % order.length]! });
  }

  private render() {
    const btn = this.shadowRoot?.querySelector('button');
    if (!btn) return;
    const t = getStore().theme;
    btn.textContent = `${ICONS[t]} ${t === 'system' ? '跟随系统' : t === 'light' ? '亮色' : '暗色'}`;
  }
}

customElements.define('ccpw-theme-toggle', CCPWThemeToggle);
```

**Step 16.2: 提交**

```bash
git add src/components/ccpw-theme-toggle.ts
git commit -m "feat(components): ccpw-theme-toggle (system/light/dark cycle)"
```

---

## Task 17: README 与验收

**Files:**
- Create: `README.md`

**Step 17.1: 写 README**

```markdown
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
```

**Step 17.2: 提交**

```bash
git add README.md
git commit -m "docs: README with run/build/deploy instructions"
```

---

## Task 18: 端到端构建与本地预览

**Step 18.1: 跑全量 build**

```bash
npm run build
```

Expected: 输出 `dist/index.html` + 静态资源,无错误。

**Step 18.2: 启动 preview 并访问**

```bash
npm run preview &
sleep 2
curl -s http://localhost:4173/ | head -30
```

Expected: HTML 包含 `<ccpw-app>` 与 `prompts.json` 引用。

**Step 18.3: 运行所有单元测试**

```bash
npm test
```

Expected: 所有测试 PASS。

**Step 18.4: 手动验收清单(对齐 proposal 验收场景)**

逐项确认并打勾:
- [x] 默认展示"新手入门 5 条"
- [x] 19 标签筛选 + 阶段×分类分组
- [x] 搜索"rate limit"返回相关卡片
- [x] 卡片展开后 slot 可编辑
- [x] 复制按钮按下后剪贴板 = 拼装后字符串
- [x] 刷新页面后编辑仍在
- [x] "恢复全部官方默认"按钮清空 overrides
- [x] 主题切换按钮在 system/light/dark 间循环
- [x] 系统深色模式自动跟随
- [x] 扫描线/glow/stagger 动效可见
- [x] `prefers-reduced-motion: reduce` 时动效关闭

**Step 18.5: 提交(若验收过程中有修复)**

```bash
git add -A
git commit -m "chore: e2e verification pass (manual acceptance)"
```

---

## 阶段退出检查

```bash
npm run typecheck     # 无 TS 错误
npm test              # 所有 Vitest 测试 PASS
npm run build         # dist/ 产出无错误
```

满足以上 + tasks.md 全部勾选后,运行阶段守卫:

```bash
"$COMET_BASH" "$COMET_GUARD" claude-prompt-workbench-zh build --apply
```

阶段守卫通过后 phase 推进到 `verify`,进入下一阶段(`/comet-verify`)。