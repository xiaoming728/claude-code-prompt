import type { SectionContent } from '../../types.js';

export const planModeContent: SectionContent = {
  id: 'plan-mode',
  label: '规划模式',
  repoUrl: 'https://code.claude.com/docs/en/permission-modes',
  intro:
    '规划模式（Plan Mode）是 Claude Code 内置的一种权限模式：在该模式下 Claude 只能读文件、跑只读命令探索代码库，不能编辑源码或执行写入操作。分析完成后，Claude 会给出一份变更计划并停下来等你明确批准——可以选择自动执行、逐条审核编辑，或者带着反馈让它继续改计划；不批准则通过 Shift+Tab 退出规划模式即可。它把"先说清楚要怎么做，再动手"变成一条硬约束，而不是靠提示词里一句"先别改"碰运气。',
  principle:
    '用 AI 来执行你自己已经想清楚的方案，而不是让 AI 代替你思考、替你决定要做什么。规划模式的价值在于让你先确认 Claude 的方案贴合你的想法，再放行它去执行。',
  install: [
    {
      name: '.claude/settings.json',
      description: '把规划模式设为项目的默认权限模式，之后每次新开会话都会先进入规划模式，而不是可直接编辑的默认模式。',
      example: '{\n  "permissions": {\n    "defaultMode": "plan"\n  }\n}',
    },
    {
      name: 'claude --permission-mode plan',
      description: '启动会话时直接进入规划模式，无需修改 settings.json，也可临时覆盖已配置的默认模式。',
      example: 'claude --permission-mode plan',
    },
  ],
  skills: [
    {
      name: 'Shift+Tab',
      description: '在 CLI 中循环切换权限模式：默认模式 → 接受编辑 → 规划模式，当前所处模式会显示在状态栏。再按一次可退出规划模式且不批准任何计划。',
    },
    {
      name: '/plan',
      description: '给单条提问临时加上规划模式的前缀，只影响这一次请求，不改变会话后续默认使用的权限模式。',
      example: '/plan 规划一下如何实现 {change}',
      slots: { change: '给列表页加分页' },
    },
    {
      name: 'Ctrl+G',
      description: 'Claude 展示计划后，用它在默认文本编辑器中直接打开并修改这份计划文本，再让 Claude 按你改过的版本继续执行。',
    },
  ],
  usage: [
    {
      name: '动代码前先规划跨文件改动',
      description: '让 Claude 先列出会改动的文件和具体思路，明确要求先不动手，把探索和改动分成两步。',
      example: '规划一下如何重构 {target} 以实现 {goal}。列出你会改动的文件，但先不要动手改',
      slots: { target: '支付模块', goal: '支持多币种' },
    },
    {
      name: '按已经想好的方案来实现',
      description: '把自己已经决定的实现思路交给 Claude，只让它规划具体怎么落地到代码，而不是重新设计方案。',
      example: '按这个思路实现 {feature}：{approach}。先说明你打算怎么改每个文件，我确认后再动手',
      slots: { feature: '登录限流', approach: '每个 IP 每分钟最多 5 次请求，超出返回 429' },
    },
    {
      name: '排查问题前先确认修复方案',
      description: '出问题时先让 Claude 说清楚打算怎么修、会改哪些文件，而不是直接改代码试错。',
      example: '{issue}。先说明你打算怎么修、会改哪些文件，不要现在就动手',
      slots: { issue: '登录接口偶发返回 500' },
    },
  ],
};
