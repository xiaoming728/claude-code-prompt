# 左侧边栏导航 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `claude-prompt-workbench-zh` 页面最外层加一个左侧边栏导航，把现有的搜索/标签/卡片列表整体包进边栏里唯一的「提示词」导航项下，移动端降级为抽屉，且为以后新增导航项打好基础，不新建任何内容路由框架。

**Architecture:** `.ccpw-shell` 内部新增 `.ccpw-body`（CSS Grid 双栏容器），左列是新组件 `<ccpw-sidebar-nav>`，右列是包住现有内容的 `.ccpw-content`。全局 `store` 新增 `activeSection`(默认 `'prompts'`) 和 `sidebarOpen`(默认 `false`) 两个字段；`ccpw-sidebar-nav` 点击项写入 `activeSection` 并高亮，`ccpw-app.ts` 用它来控制 `.ccpw-content` 的显隐（目前恒为显示，因为只有一个 section）。移动端 `<640px` 时 `ccpw-sidebar-nav` 变成 `position:fixed` 抽屉，配合 header 里新增的 `☰` 按钮和一个 `.ccpw-backdrop` 遮罩层。

**Tech Stack:** TypeScript (strict) + 原生 Web Components (无框架) + Vite + Vitest + 纯 CSS (CSS Custom Properties, 无预处理器)。

## Global Constraints

- 不新建内容路由/多 section 切换框架——`NAV_ITEMS` 目前只有一项，`activeSection` 判断只覆盖 `'prompts'` 一个分支（design spec 第 4、7 节）。
- 断点复用 `layout.css` 已有的 `@media (max-width: 640px)`，不新增别的断点。
- 组件延续项目现有写法：Shadow DOM + `subscribe(store)` 手动重渲染，不引入任何 UI 框架或状态库。
- 组件级（DOM 行为）不补单元测试——项目目前只有 `data`/`state`/`build-content` 三层有单测，这次延续该惯例；新状态字段(`activeSection`/`sidebarOpen`)本身要有单测。

参考设计文档：`docs/superpowers/specs/2026-07-04-sidebar-nav-design.md`

---

### Task 1: Store 新增 `activeSection` / `sidebarOpen` 字段

**Files:**
- Modify: `src/state/store.ts`
- Test: `tests/unit/store.test.ts`

**Interfaces:**
- Produces: `Store.activeSection: string`（默认 `'prompts'`），`Store.sidebarOpen: boolean`（默认 `false`）。后续任务通过 `getStore().activeSection` / `getStore().sidebarOpen` 读取，`setStore({ activeSection, sidebarOpen })` 写入。

- [ ] **Step 1: 在 `tests/unit/store.test.ts` 补充失败的测试**

把文件里第一个 `it('初始状态含默认值', ...)` 换成下面这样（在原有断言后面加两行），并在 `describe('store', ...)` 块末尾新增一个测试：

```ts
  it('初始状态含默认值', () => {
    const s = getStore();
    expect(s.theme).toBe('system');
    expect(s.q).toBe('');
    expect(s.sel).toBeNull();
    expect(s.start).toBe(true);
    expect(s.overrides).toEqual({});
    expect(s.activeSection).toBe('prompts');
    expect(s.sidebarOpen).toBe(false);
  });
```

```ts
  it('activeSection/sidebarOpen 可写入,且 _resetStore 能恢复默认值', () => {
    setStore({ activeSection: 'other', sidebarOpen: true });
    expect(getStore().activeSection).toBe('other');
    expect(getStore().sidebarOpen).toBe(true);
    _resetStore();
    expect(getStore().activeSection).toBe('prompts');
    expect(getStore().sidebarOpen).toBe(false);
  });
```

- [ ] **Step 2: 运行测试,确认失败**

Run: `npx vitest run tests/unit/store.test.ts`
Expected: FAIL — `s.activeSection` / `s.sidebarOpen` 是 `undefined`，断言不通过（TS 编译层面也会报 `Store` 上没有这两个字段，因为 Step 3 还没做）。

- [ ] **Step 3: 修改 `src/state/store.ts`**

把整个文件内容替换为：

```ts
import type { Override, Role, Theme } from '../types.js';

export interface Store {
  theme: Theme;
  q: string;
  sel: Role | null;
  start: boolean;
  overrides: Record<string, Override>;
  prefersReducedMotion: boolean;
  activeSection: string;
  sidebarOpen: boolean;
}

const subs = new Set<() => void>();
let state: Store = {
  theme: 'system',
  q: '',
  sel: null,
  start: true,
  overrides: {},
  prefersReducedMotion: false,
  activeSection: 'prompts',
  sidebarOpen: false,
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
    activeSection: 'prompts',
    sidebarOpen: false,
  };
  subs.clear();
}
```

- [ ] **Step 4: 运行测试,确认通过**

Run: `npx vitest run tests/unit/store.test.ts`
Expected: PASS，6 个测试全绿（原有 5 个 + 新增 1 个）。

- [ ] **Step 5: Commit**

```bash
git add src/state/store.ts tests/unit/store.test.ts
git commit -m "feat(store): add activeSection and sidebarOpen fields for sidebar nav"
```

---

### Task 2: `layout.css` 双栏 Grid + 响应式抽屉外壳样式

**Files:**
- Modify: `src/styles/layout.css`

**Interfaces:**
- Consumes: 无（纯 CSS，class 名是约定，Task 3/4 里的组件和标记要用到 `.ccpw-body`、`.ccpw-sidebar-toggle`、`.ccpw-backdrop`、`.ccpw-backdrop.open`）。
- Produces: 桌面 224px 固定宽双栏网格；`<640px` 时单列 + 显示 `☰` 按钮 + `.ccpw-backdrop.open` 显示遮罩。这些 class 名是 Task 4 里 `ccpw-app.ts` 标记必须匹配的契约。

- [ ] **Step 1: 替换 `src/styles/layout.css` 全文**

```css
.ccpw-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 56px 32px 96px;
}

.ccpw-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 28px;
  margin-bottom: 28px;
  border-bottom: 1px solid var(--ccpw-border);
}

.ccpw-header h1 {
  flex: 1;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.ccpw-sidebar-toggle {
  display: none;
  padding: 6px 10px;
  border: 1px solid var(--ccpw-border);
  border-radius: 6px;
  font-size: 16px;
  color: var(--ccpw-text-2);
}

.ccpw-body {
  display: grid;
  grid-template-columns: 224px 1fr;
  gap: 40px;
  align-items: start;
}

.ccpw-backdrop {
  display: none;
}

.ccpw-footer {
  display: flex;
  justify-content: center;
  margin-top: 56px;
  padding-top: 28px;
  border-top: 1px solid var(--ccpw-border-subtle);
}

.ccpw-footer button {
  padding: 8px 16px;
  border: 1px solid var(--ccpw-border);
  border-radius: 8px;
  color: var(--ccpw-text-3);
  font-size: 13px;
  transition: border-color 200ms, color 200ms;
}

.ccpw-footer button:hover {
  border-color: var(--ccpw-text-4);
  color: var(--ccpw-text-2);
}

@media (max-width: 640px) {
  .ccpw-shell { padding: 32px 20px 64px; }
  .ccpw-header h1 { font-size: 22px; }

  .ccpw-sidebar-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .ccpw-body { grid-template-columns: 1fr; }

  .ccpw-backdrop.open {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 40;
  }
}
```

- [ ] **Step 2: 类型检查(确认没有引入语法层面的构建问题)**

Run: `npx tsc --noEmit`
Expected: 无输出，退出码 0（CSS 文件不参与 TS 类型检查，这一步只是确认这次改动没有连带弄坏别的东西）。

这一步没有自动化的 CSS 断言——视觉效果和抽屉交互留到 Task 5 用浏览器手动验证，和 spec 第 6 节的测试计划一致。

- [ ] **Step 3: Commit**

```bash
git add src/styles/layout.css
git commit -m "style(layout): add grid sidebar layout and mobile drawer chrome styles"
```

---

### Task 3: 新建 `ccpw-sidebar-nav` 组件

**Files:**
- Create: `src/components/ccpw-sidebar-nav.ts`

**Interfaces:**
- Consumes: `getStore()`/`setStore()`/`subscribe()` from `src/state/store.ts`（`Store.activeSection: string`, `Store.sidebarOpen: boolean`，来自 Task 1）。
- Produces: 自定义元素 `<ccpw-sidebar-nav>`。宿主元素在 `sidebarOpen=true` 时自带 `.open` class（供 Task 2 里 `:host(.open)` 规则响应，样式写在组件自己的 shadow `<style>` 里，不需要 `layout.css` 关心）。点击其中某一项会 `setStore({ activeSection, sidebarOpen: false })`。

- [ ] **Step 1: 创建 `src/components/ccpw-sidebar-nav.ts`**

```ts
import { getStore, setStore, subscribe } from '../state/store.js';

const NAV_ITEMS: { id: string; label: string }[] = [
  { id: 'prompts', label: '提示词' },
];

class CCPWSidebarNav extends HTMLElement {
  private unsub?: () => void;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        nav { display: flex; flex-direction: column; gap: 4px; }
        button {
          display: block; width: 100%; text-align: left;
          padding: 8px 12px; border-radius: 8px;
          color: var(--ccpw-text-2); font-size: 14.5px;
          transition: background-color 150ms, color 150ms;
        }
        button:hover { background: var(--ccpw-surface); }
        button.active {
          background: var(--ccpw-accent-bg);
          color: var(--ccpw-accent);
          font-weight: 500;
        }
        @media (max-width: 640px) {
          :host {
            position: fixed; left: 0; top: 0; height: 100%; width: 224px;
            padding: 20px 16px; background: var(--ccpw-bg);
            border-right: 1px solid var(--ccpw-border);
            transform: translateX(-100%);
            transition: transform 200ms ease;
            z-index: 50;
            overflow-y: auto;
          }
          :host(.open) { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          :host { transition: none; }
        }
      </style>
      <nav part="nav"></nav>
    `;
    this.render();
    this.unsub = subscribe(() => this.render());
  }

  disconnectedCallback() {
    this.unsub?.();
  }

  private render() {
    const nav = this.shadowRoot!.querySelector('nav')!;
    const s = getStore();
    this.classList.toggle('open', s.sidebarOpen);
    nav.replaceChildren(...NAV_ITEMS.map(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = item.label;
      btn.className = s.activeSection === item.id ? 'active' : '';
      btn.addEventListener('click', () => {
        setStore({ activeSection: item.id, sidebarOpen: false });
      });
      return btn;
    }));
  }
}

customElements.define('ccpw-sidebar-nav', CCPWSidebarNav);
```

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无输出，退出码 0。

- [ ] **Step 3: 运行全量单测,确认没有破坏既有行为**

Run: `npx vitest run`
Expected: 全部测试通过（这个新文件不影响 `data`/`state`/`persistence`/`build-content` 任何一层）。

组件本身的点击/高亮/抽屉行为留到 Task 5 用浏览器手动验证。

- [ ] **Step 4: Commit**

```bash
git add src/components/ccpw-sidebar-nav.ts
git commit -m "feat(sidebar): add ccpw-sidebar-nav component"
```

---

### Task 4: 改造 `ccpw-app.ts`：接入侧边栏、汉堡按钮、遮罩

**Files:**
- Modify: `src/components/ccpw-app.ts`

**Interfaces:**
- Consumes: `<ccpw-sidebar-nav>`(Task 3)、`.ccpw-body`/`.ccpw-sidebar-toggle`/`.ccpw-backdrop`(Task 2 CSS 契约)、`Store.activeSection`/`Store.sidebarOpen`(Task 1)。
- Produces: `.ccpw-content` 的 `hidden` 属性由 `activeSection !== 'prompts'` 驱动（目前恒为 `false`，即恒可见）；`.ccpw-backdrop` 的 `.open` class 和 `.ccpw-sidebar-toggle` 的 `aria-expanded` 属性由 `sidebarOpen` 驱动。

- [ ] **Step 1: 替换 `src/components/ccpw-app.ts` 全文**

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
import './ccpw-sidebar-nav.js';

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
  private unsub?: () => void;

  connectedCallback() {
    this.innerHTML = `
      <div class="ccpw-shell">
        <header class="ccpw-header">
          <button class="ccpw-sidebar-toggle" type="button" aria-label="打开导航" aria-expanded="false">☰</button>
          <h1>Claude 提示词工作台</h1>
          <ccpw-theme-toggle></ccpw-theme-toggle>
        </header>
        <div class="ccpw-body">
          <ccpw-sidebar-nav></ccpw-sidebar-nav>
          <div class="ccpw-content">
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
        </div>
        <div class="ccpw-backdrop"></div>
      </div>
    `;
    this.querySelector('#ccpw-reset-all')!.addEventListener('click', () => {
      clearAllOverrides();
      setStore({ overrides: {} });
    });

    const toggleBtn = this.querySelector('.ccpw-sidebar-toggle') as HTMLButtonElement;
    const backdrop = this.querySelector('.ccpw-backdrop') as HTMLElement;
    const content = this.querySelector('.ccpw-content') as HTMLElement;

    toggleBtn.addEventListener('click', () => {
      setStore({ sidebarOpen: !getStore().sidebarOpen });
    });
    backdrop.addEventListener('click', () => {
      setStore({ sidebarOpen: false });
    });

    const syncChrome = () => {
      const s = getStore();
      backdrop.classList.toggle('open', s.sidebarOpen);
      toggleBtn.setAttribute('aria-expanded', String(s.sidebarOpen));
      content.hidden = s.activeSection !== 'prompts';
    };
    syncChrome();
    this.unsub = subscribe(syncChrome);

    bootstrapCatalog();
  }

  disconnectedCallback() {
    this.unsub?.();
  }
}

customElements.define('ccpw-app', CCPWApp);
```

- [ ] **Step 2: 类型检查**

Run: `npx tsc --noEmit`
Expected: 无输出，退出码 0。

- [ ] **Step 3: 运行全量单测**

Run: `npx vitest run`
Expected: 全部测试通过（29+ 个，具体数量以 Task 1 后的总数为准）。

- [ ] **Step 4: 本地构建冒烟测试**

Run: `npm run build`
Expected: 以 `✓ Built 52 prompts → public/prompts.json` 开头，随后 Vite 输出 `dist/` 产物，无报错退出。

- [ ] **Step 5: Commit**

```bash
git add src/components/ccpw-app.ts
git commit -m "feat(app): wire sidebar nav, mobile drawer toggle, and backdrop into ccpw-app"
```

---

### Task 5: 手动浏览器验证（无代码改动）

**Files:** 无新增/修改文件。

**Interfaces:** 无（这一步只是按 spec 第 6 节的手动验证清单跑一遍，确认 Task 1-4 组合起来的真实效果）。

- [ ] **Step 1: 启动开发服务器**

Run: `npm run dev -- --port 5173 --strictPort`
Expected: 输出 `Local: http://localhost:5173/`。

- [ ] **Step 2: 桌面宽屏验证**

用浏览器（或 browsermcp）打开 `http://localhost:5173/`，确认：
- 页面呈双栏布局，左侧 224px 固定宽的「提示词」导航，右侧是原来的搜索框/标签栏/卡片列表。
- 左侧「提示词」项处于高亮选中状态。
- 顶部没有出现 `☰` 按钮。

- [ ] **Step 3: 移动端 / 窄视口验证**

把视口宽度改到 `<640px`（浏览器 DevTools 或 browsermcp 的窄视口截图）,确认：
- 左侧栏默认不可见，`header` 左侧出现 `☰` 按钮。
- 点击 `☰`，侧边栏从左侧滑入，同时出现半透明遮罩。
- 点击遮罩，侧边栏滑出关闭。
- 重新打开侧边栏后点击「提示词」这一项，侧边栏自动收起（`sidebarOpen` 变回 `false`）。

- [ ] **Step 4: 回归确认**

确认现有功能不受影响：搜索框过滤、标签点击筛选（含之前修过的分类标签 bug）、卡片展开/复制、主题切换、"恢复全部官方默认" 均正常工作。

无代码改动，这一步不需要 commit。若手动验证发现问题，回到对应 Task 修正、补测试、再提交——不在本计划范围内预先写好这类修复。
