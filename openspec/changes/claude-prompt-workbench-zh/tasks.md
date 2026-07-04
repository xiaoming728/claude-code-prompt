## 1. 项目骨架与基础设施

- [x] 1.1 在 `main` 创建 `feat/claude-prompt-workbench-zh` 分支(branch 隔离)
- [x] 1.2 初始化 `package.json`、`.gitignore`、`tsconfig.json`(strict 模式)
- [x] 1.3 安装核心依赖:`vite`、`typescript`、`unified`、`remark-parse`、`remark-frontmatter`、`remark-gfm`、`gray-matter`、`yaml`
- [x] 1.4 配置 `vite.config.ts`(`base: './'`,`build.outDir: 'dist'`)
- [x] 1.5 创建目录骨架:`src/`、`content/prompts/`、`scripts/`、`public/`

## 2. 内容管线(Markdown → JSON)

- [x] 2.1 编写 `scripts/build-content.ts`:读取 `content/prompts/*.md`,用 remark 解析 frontmatter 与正文
- [x] 2.2 定义 TypeScript 类型 `Prompt`、`Phase`、`Cat`、`Role`(覆盖 frontmatter 全部字段)
- [x] 2.3 在 `content/prompts/` 内编写 52 个 `.md` 文件(含中文 title/prompt/teaches/next 翻译,以 MCP 浏览器实际抓取的英文原文为基准,**严禁变造**)
- [x] 2.4 在 `package.json` 中添加 `build:content` 脚本,产出 `public/prompts.json`
- [x] 2.5 在 `vite.config.ts` 中接入内容构建为前置步骤,确保 `npm run build` 先跑内容编译

## 3. 数据加载与领域模型

- [x] 3.1 实现 `src/data/prompts.ts`:`fetch('/prompts.json')` + 类型守卫 + 运行时校验
- [x] 3.2 实现 `src/data/taxonomy.ts`:导出 19 个 role、5 个 phase、15 个 cat 的中英对照与排序
- [x] 3.3 实现 `src/data/search.ts`:标题 + 正文全文检索(简单 `includes` 即可,数据规模小)

## 4. 状态管理与持久化

- [x] 4.1 实现 `src/state/store.ts`:轻量发布订阅 store,持 `theme`、`overrides`、`prefersReducedMotion`
- [x] 4.2 实现 `src/state/persistence.ts`:`localStorage` 读写,key 命名空间 `ccpw:zh:v1:*`,容错降级
- [x] 4.3 实现 `src/state/theme.ts`:检测 `prefers-color-scheme` + 手动切换 + CSS 变量切换
- [x] 4.4 实现 `src/state/motion.ts`:检测 `prefers-reduced-motion` 并通过事件订阅传播

## 5. Web Components 实现

- [x] 5.1 `<ccpw-app>`:根组件,组装搜索/筛选/列表/主题切换/动效
- [x] 5.2 `<ccpw-search>`:搜索框,实时回写到 store
- [x] 5.3 `<ccpw-tag-bar>`:19 个 role 标签筛选 + "新手入门"切换
- [x] 5.4 `<ccpw-prompt-list>`:按 phase × cat 分组,支持 stagger 入场动效
- [x] 5.5 `<ccpw-prompt-card>`:卡片展示/展开,内联 slot 编辑,一键复制,恢复默认
- [x] 5.6 `<ccpw-theme-toggle>`:主题手动切换按钮
- [x] 5.7 `<ccpw-empty-state>`:无结果占位

## 6. 样式与动效(黑底莱姆绿 terminal 风)

- [x] 6.1 全局 CSS 变量定义(亮/暗双主题):背景、前景、accent、border、glow、scanline 等
- [x] 6.2 字体栈:`ui-monospace` + 中文字体回退(`PingFang SC`、`Microsoft YaHei`)
- [x] 6.3 扫描线 + 网格 + 微噪点背景层(`mix-blend-mode`,`pointer-events: none`)
- [x] 6.4 glow / chromatic-aberration 描边(hover 状态)
- [x] 6.5 卡片展开/折叠动效 + 内容逐行 typewriter
- [x] 6.6 标签切换 stagger fade-in
- [x] 6.7 复制成功 ripple / "已复制" 微动效
- [x] 6.8 主题切换平滑过渡(~400ms color/gradient)
- [x] 6.9 `@media (prefers-reduced-motion: reduce)` 降级所有动效

## 7. 验收与文档

- [x] 7.1 `README.md`:介绍、跑起来的命令、目录结构、部署说明、贡献指南
- [x] 7.2 跑一遍 proposal 中的验收场景清单,逐项打勾
- [x] 7.3 `npm run build` 产出 `dist/` 在本地 `npx serve dist` 可访问
- [x] 7.4 检查 `dist/index.html` 引用资源均为相对路径,支持双击打开
- [x] 7.5 在分支上 commit 全部变更

## 8. 合并与收尾

- [ ] 8.1 切回 `main`,merge `feat/claude-prompt-workbench-zh`(无 fast-forward,保留 feature 历史)
- [ ] 8.2 打 tag `v0.1.0`
- [ ] 8.3 推送 `main` 与 tag 到远端