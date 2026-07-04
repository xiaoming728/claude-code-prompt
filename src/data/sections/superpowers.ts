import type { SectionContent } from '../../types.js';

export const superpowersContent: SectionContent = {
  id: 'superpowers',
  label: 'Superpowers',
  repoUrl: 'https://github.com/obra/superpowers',
  intro:
    'Superpowers 是一套面向编码 Agent 的完整软件开发方法论，以一组可组合的 Skill（技能）和配套的启动指令为基础构建。它解决的核心问题是：Agent 拿到需求后往往直接开始写代码，跳过澄清、设计和验证环节，导致返工和跑偏。Superpowers 让 Agent 先通过提问理清真实诉求，再分段展示设计供确认，随后拆解为可执行的实施计划，最后以测试驱动、分阶段评审的方式落地。这些 Skill 会根据上下文自动触发，无需手动调用，目前支持 Claude Code、Cursor、Codex 等多种编码 Agent 平台。',
  install: [],
  usage: [
    {
      name: 'brainstorming',
      description: '在写代码之前通过苏格拉底式提问打磨想法，探索多种方案并分段展示设计文档供用户确认。',
      example: '/brainstorming {request}',
      slots: { request: '帮我头脑风暴一下这个功能该怎么设计，先别写代码' },
    },
    {
      name: 'writing-plans',
      description: '在设计通过后，把工作拆解成每个 2-5 分钟即可完成的任务，每个任务包含确切文件路径和验证步骤。',
      example: '/writing-plans {request}',
      slots: { request: '设计已经确认了，帮我写一份详细的实施计划' },
    },
    {
      name: 'using-git-worktrees',
      description: '在设计获批后创建隔离的新分支工作区，执行项目初始化并确认测试基线干净。',
      example: '/using-git-worktrees {request}',
      slots: { request: '给这个任务创建一个独立的 git worktree 工作区' },
    },
    {
      name: 'subagent-driven-development',
      description: '为每个任务派发全新的子 Agent 执行，并进行"规格符合性"与"代码质量"两阶段评审。',
      example: '/subagent-driven-development {request}',
      slots: { request: '开始吧，用 subagent 逐个任务执行并双阶段评审' },
    },
    {
      name: 'executing-plans',
      description: '按批次执行实施计划，并在关键节点暂停等待人工确认后再继续。',
      example: '/executing-plans {request}',
      slots: { request: '按计划批量执行任务，每批结束后等我确认' },
    },
    {
      name: 'test-driven-development',
      description: '强制执行 RED-GREEN-REFACTOR 循环：先写失败的测试，再写最小实现使其通过，最后重构。',
      example: '/test-driven-development {request}',
      slots: { request: '用测试驱动开发的方式实现这个功能' },
    },
    {
      name: 'systematic-debugging',
      description: '遇到 bug 或测试失败时，按四阶段流程定位根因，而不是凭猜测直接改代码。',
      example: '/systematic-debugging {request}',
      slots: { request: '这个测试一直失败，帮我系统性地排查根因' },
    },
    {
      name: 'verification-before-completion',
      description: '在声称修复完成或功能可用之前，先运行验证命令并确认实际结果，而非仅凭断言。',
      example: '/verification-before-completion {request}',
      slots: { request: '在说完成之前，先验证一下这个修复是不是真的生效了' },
    },
    {
      name: 'requesting-code-review',
      description: '任务之间发起代码评审，对照计划检查实现，并按严重程度上报问题，严重问题会阻塞后续进度。',
      example: '/requesting-code-review {request}',
      slots: { request: '这个任务做完了，帮我发起一次代码评审' },
    },
    {
      name: 'receiving-code-review',
      description: '收到代码评审反馈后，按规范流程逐条核实并落实修改，而不是不加甄别地全盘接受。',
      example: '/receiving-code-review {request}',
      slots: { request: '收到这些评审意见了，帮我逐条处理' },
    },
    {
      name: 'finishing-a-development-branch',
      description: '任务全部完成后确认测试通过，并给出合并、发 PR、保留或丢弃分支等选项，同时清理工作区。',
      example: '/finishing-a-development-branch {request}',
      slots: { request: '所有任务都完成了，帮我收尾这个开发分支' },
    },
    {
      name: 'writing-skills',
      description: '按照最佳实践创建或修改新的 Skill，包含配套的测试方法论。',
      example: '/writing-skills {request}',
      slots: { request: '照着 writing-skills 的规范帮我写一个新技能' },
    },
  ],
};
