# 左侧边栏导航 — Technical Design

## 1. 背景与目标

当前页面结构是单栏：`<ccpw-app>` 顶部 `header`（标题 + 主题切换），下面依次是 `ccpw-search`、`ccpw-tag-bar`、`main`（`ccpw-prompt-list` + `ccpw-empty-state`）、`footer`。

用户希望新增一个左侧边栏，把现有内容归到边栏里的「提示词」这一个导航项下，为以后新增其他内容板块（板块具体是什么，本次不需要确定）预留结构。明确排除的方案：把现有的分类标签（理解/计划/原型…）搬进侧边栏当成二级导航——用户要的是更外层的一层包装，现有的 `search + tag-bar + prompt-list` 整体保持不变。

## 2. 架构总览

```
.ccpw-shell (max-width:1120px, 居中, 原有 padding)
  .ccpw-header (不变; 新增仅 <640px 可见的 ☰ 按钮,放标题左边)
  .ccpw-body (新增, Grid 双栏容器)
    <ccpw-sidebar-nav>              ← 新组件, 224px 固定宽列
    .ccpw-content (flex:1, 原有内容原样搬入)
      <ccpw-search>
      <ccpw-tag-bar>
      <main>...</main>
      <footer class="ccpw-footer">...</footer>
  .ccpw-backdrop (新增, 仅移动端抽屉打开时显示的遮罩)
```

`ccpw-search` / `ccpw-tag-bar` / `ccpw-prompt-list` / `ccpw-prompt-card` 内部实现不变，只是被包进 `.ccpw-content` 容器。

### 双栏布局实现方式

`.ccpw-body { display:grid; grid-template-columns: 224px 1fr; gap: 40px; }`。

选择 CSS Grid 而非 Flexbox：项目目前是纯 CSS、零构建时框架的风格，Grid 在双栏比例控制上写法比 flex-basis 更直接，改动集中在 `layout.css` 一处。

## 3. 组件设计

新增 `src/components/ccpw-sidebar-nav.ts`，沿用现有 Shadow DOM + 订阅全局 store 的写法（参考 `ccpw-theme-toggle.ts`）：

```ts
const NAV_ITEMS: { id: string; label: string }[] = [
  { id: 'prompts', label: '提示词' },
];
```

以后新增内容板块，只需要往 `NAV_ITEMS` 里加一项，不需要改组件逻辑。

渲染为一个 `<nav>` 列表，每项是一个 button；当前选中项（`getStore().activeSection === item.id`）用背景色 `var(--ccpw-accent-bg)` + 文字色 `var(--ccpw-accent)` 高亮，风格与 `ccpw-prompt-card.ts` 里 `.chip`/`.next` 的强调色用法一致。

组件同时负责移动端抽屉的展开/收起：订阅 `store.sidebarOpen`，为宿主元素切 `.open` class。

## 4. 数据流：`activeSection` 状态

- `src/state/store.ts`：`Store` 接口新增 `activeSection: string`，默认值 `'prompts'`；`sidebarOpen: boolean`，默认值 `false`。`_resetStore()` 同步更新这两个默认值。
- 点击 `ccpw-sidebar-nav` 里的某一项 → `setStore({ activeSection: item.id, sidebarOpen: false })`（选中后顺带收起移动端抽屉）。
- `ccpw-app.ts` 的 `.ccpw-content` 目前只在 `activeSection === 'prompts'` 时渲染——因为现在只有这一个 section，效果上内容永远显示，但状态读写的闭环是完整、真实生效的，不是摆设。

**明确的范围边界**：本次不实现除「提示词」外的任何第二个内容板块，也不做"内容区注册表/路由"之类的通用机制。以后加第二个板块时，需要：① `NAV_ITEMS` 加一项；② 在 `.ccpw-content` 旁边加一个新内容块，用同样的 `activeSection === 'xxx'` 分支控制显隐。这是刻意的最小化范围决策，避免为不存在的板块预先搭建框架。

## 5. 响应式 / 移动端行为

断点复用 `layout.css` 里已有的 `@media (max-width: 640px)`。

**桌面（≥640px）**：`ccpw-sidebar-nav` 正常占 224px 固定列，无抽屉行为，`.ccpw-backdrop` 不渲染/`display:none`。

**移动端（<640px）**：

- `.ccpw-body` 的 `grid-template-columns` 改为 `1fr`（单列）。
- `ccpw-sidebar-nav` 用 `position:fixed; left:0; top:0; height:100%; width:224px; transform:translateX(-100%); transition:transform 200ms;`，`.open` class 时 `transform:translateX(0)`。
- `.ccpw-header` 左侧新增一个仅 `<640px` 显示的 `☰` 按钮（写在 `ccpw-app.ts` 模板里的 plain `<button>`，和 footer 的"恢复全部官方默认"按钮同样的写法），点击 `setStore({ sidebarOpen: !getStore().sidebarOpen })`。
- `.ccpw-backdrop` 是 `ccpw-app.ts` 模板里的一个 plain `<div>`，`sidebarOpen=true` 时显示为半透明遮罩，点击遮罩关闭抽屉（`setStore({ sidebarOpen: false })`）。
- 选中侧边栏某一项后自动收起抽屉（见第 4 节）。
- 动画遵循 `tokens.css` 里已有的 `prefers-reduced-motion` 全局开关。

## 6. 测试计划

- `tests/unit/store.test.ts`：补充 `activeSection` 默认值为 `'prompts'`、`sidebarOpen` 默认值为 `false` 的断言，以及 `_resetStore` 同步重置的验证——写法与现有 `theme`/`sel`/`start` 的测试一致。
- 项目目前只有 `data`/`state`/`build-content` 三层有单测，组件（`ccpw-tag-bar`/`ccpw-search` 等）没有单测；`ccpw-sidebar-nav` 延续这个惯例，不额外补组件级单测。
- 手动浏览器验证（browsermcp）：
  - 桌面宽屏截图确认双栏布局、侧边栏 224px 固定宽、内容区不因为多了侧边栏而挤压变形。
  - 点击"提示词"确认高亮态（虽然此时切换后内容不变）。
  - 缩窄视口到 <640px，验证：☰ 按钮出现、点击后抽屉滑入 + 遮罩出现、点击遮罩关闭、点击导航项后自动收起。

## 7. 不在本次范围内

- 除「提示词」外的任何具体内容板块（板块内容是什么、有多少个，都还没定）。
- 侧边栏的搜索/过滤能力（搜索框仍然只搜提示词，不搜导航项）。
- 桌面端侧边栏的折叠/隐藏（本次桌面端侧边栏始终展开显示）。

## 8. Implementation Divergence

本设计文档写作时（第 4 节）明确把"除提示词外的任何第二个内容板块"划为不在范围内。但在同一个 build 阶段的后续迭代中，用户直接提出并确认了新增需求，实际实现远超本节原定边界：

- `NAV_ITEMS` 演进为分组结构 `NAV_GROUPS`（`Claude Code` / `AI 编码最佳实践`两组），而不是本文档设想的单条目扁平列表。
- 新增 6 个真实内容板块并全部接入 `activeSection` 路由：OpenSpec、Superpowers、ECC、gstack、Comet、规划模式（Plan Mode）。每个板块的命令/示例内容均基于对应项目的真实文档或已安装包核对，经过 100 分制评审循环（>95 分）。
- 其中"规划模式"板块的信息来源是 `https://code.claude.com/docs/en/permission-modes`——与本 change 的 `proposal.md`"不影响范围"一节"不翻译或重建 code.claude.com 其他文档页面"这条描述不再一致；该板块并非逐句翻译官方页面，而是围绕其核心机制（权限模式切换、`/plan`、Ctrl+G 改计划）重新组织为工作台自己的教学内容，但信息源头确实来自该文档。

**处理方式**：按用户决策，不回退重写本设计文档或 proposal，原文保留作为该次设计会话的真实历史记录；此偏差在 comet-verify 归档前的验证报告中登记为已知且已接受的范围扩展，不视为验证失败项。归档时 `design.md`/`proposal.md`（以及本文档）将按 comet-archive 惯例标记为 `superseded-by-main-spec`，后续如需再扩展板块，应以本文档记录的实际结构（`NAV_GROUPS`）为准，而非第 3/7 节的原始设想。
