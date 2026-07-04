# Brainstorm Summary

- Change: claude-prompt-workbench-zh
- Date: 2026-07-04

## 确认的技术方案

**方案 2:运行时只读 JSON**

- TypeScript + Vite + 原生 ES Modules + Web Components(零运行时 UI 框架)
- 内容以 Markdown + YAML frontmatter 为权威源,构建期由 remark/unified 编译为 `public/prompts.json`
- 运行时仅 fetch `prompts.json`,**不再加载 md**;内容修订需重新跑 build
- 全局状态(theme / q / sel / start / overrides)走轻量 pub/sub store,几十行 TS
- localStorage key 命名空间 `ccpw:zh:v1:*`,所有读写 try/catch 容错
- 7 个 Web Components:`<ccpw-app>`、`<ccpw-search>`、`<ccpw-tag-bar>`、`<ccpw-prompt-list>`、`<ccpw-prompt-card>`、`<ccpw-theme-toggle>`、`<ccpw-empty-state>`
- Shadow DOM 隔离样式,CSS Custom Properties 抽象亮/暗主题
- 黑底 + 莱姆绿 terminal 极客风,扫描线/网格/glow/typewriter/stagger/chromatic-aberration 动效,均遵守 `prefers-reduced-motion: reduce`

## 关键取舍与风险

- **取舍 1(已采纳方案 2)**:放弃运行时 md 直读,用户改翻译必须重 build → 简化运行时实现,但失去"内容热改"灵活性。v0.1 可接受。
- **取舍 2(轻量 pub/sub store)**:不引入响应式库,几十行手写代码,但需手动管理订阅生命周期与重渲染。
- **风险 1(数据准确性)**:官方 52 条 prompt 中,有 51 张的 teaches / next 字段因 MCP 浏览器 WebSocket 持续超时无法实时抓取。build 阶段必须从已保存的 `/tmp/prompt-library.html`(React Server Component payload)中精确抽取,**严禁编造**。
- **风险 2(localStorage 隐私模式)**:Safari/Edge 隐私模式下写入抛错,需 try/catch 回退内存,并在 UI 上提示"此浏览器不支持持久化"。
- **风险 3(Web Components 兼容性)**:Safari < 16.4 在部分 edge case 上支持不全,主流通用浏览器已全部支持。
- **Trade-off(包体 vs 控制力)**:零运行时框架换来自研全部动效与样式的完全控制,代价是开发速度略低于 React/Vue,但本应用规模小(组件数 < 10),可接受。

## 测试策略

- **Vitest 单元**(纯逻辑层):
  - `src/data/prompts.ts` 类型守卫(缺失字段、未知 cat/role 报错)
  - `src/state/store.ts` pub/sub 行为
  - `src/state/persistence.ts` 容错(localStorage 抛错回退、损坏 JSON 静默丢弃)
  - `scripts/build-content.ts` frontmatter 校验
- **Playwright e2e**(行为层):
  - 页面加载 52 条卡片渲染完整
  - 搜索过滤、标签筛选、阶段×分类分组
  - 卡片展开 + slot 编辑 + 复制(断言剪贴板 = 拼装后字符串)
  - 主题切换 + localStorage 往返
  - "恢复官方默认"按钮清除 override 后回显原始 prompt

## Spec Patch

无。本次变更为全新能力引入,8 个 capabilities(prompt-catalog / prompt-browsing / prompt-editing / clipboard-copy / local-persistence / theme-system / motion-system / static-build-deploy)均已在 proposal.md 中定义,不修改任何已存在 spec。