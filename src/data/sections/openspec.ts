import type { SectionContent } from '../../types.js';

export const openspecContent: SectionContent = {
  id: 'openspec',
  label: 'OpenSpec',
  repoUrl: 'https://github.com/Fission-AI/openspec',
  intro:
    'OpenSpec 是一个面向 AI 编码助手的 spec-driven development（规格驱动开发）框架，核心目标是让人类与 AI 在动手写代码之前就对"要构建什么"达成一致。它在需求和实现之间加入一层轻量的规格（spec）文档，通过 proposal、design、tasks 等制品固化共识，从而降低 AI 辅助编码中常见的方向跑偏和返工问题。框架同时提供 CLI 工具和一组配套的 slash 命令，覆盖从提出变更、澄清方案、编写任务、实施代码到验证与归档的完整工作流。',
  install: [
    {
      name: 'openspec init',
      description: '在项目目录中初始化 OpenSpec，生成目录结构并为指定的 AI 工具（如 Claude、Cursor 等）配置集成。',
      example: 'openspec init [path] [--tools <list>] [--force] [--profile <profile>]',
    },
    {
      name: 'openspec update',
      description: '在 CLI 升级后刷新 AI 助手的指令文件，确保 slash 命令保持最新版本。',
      example: 'openspec update [path] [--force]',
    },
  ],
  skills: [],
  usage: [
    {
      name: 'openspec list',
      description: '列出当前项目中的所有 change（变更提案）或已归档的 spec（规格）。',
      example: 'openspec list [--specs] [--changes] [--sort <order>] [--json]',
    },
    {
      name: 'openspec show',
      description: '查看某个 change 或 spec 的详细内容，包括 delta（增量变更）和场景（scenarios）。',
      example: 'openspec show {item-name} [--type <type>] [--deltas-only]',
      slots: { 'item-name': 'add-dark-mode' },
    },
    {
      name: 'openspec validate',
      description: '检查 change 或 spec 文件是否存在结构性问题，可用于本地校验或 CI 流水线。',
      example: 'openspec validate --all --strict',
    },
    {
      name: 'openspec archive',
      description: '将已完成的 change 归档，把其规格变更合并进主 spec 并移动到归档目录。',
      example: 'openspec archive {change-name} -y',
      slots: { 'change-name': 'add-dark-mode' },
    },
    {
      name: 'openspec view',
      description: '打开交互式仪表盘，浏览项目中所有 change 与 spec 的整体状态。',
      example: 'openspec view',
    },
    {
      name: '/opsx:propose',
      description: '一步创建新的 change，并同时生成 proposal、design、tasks 等规划制品。',
      example: '/opsx:propose {change-name}',
      slots: { 'change-name': 'add-dark-mode' },
    },
    {
      name: '/opsx:explore',
      description: '在不创建正式 change 的前提下探索想法、权衡方案、澄清需求。',
      example: '/opsx:explore',
    },
    {
      name: '/opsx:apply',
      description: '按照 change 中的任务列表逐项实施代码。',
      example: '/opsx:apply',
    },
    {
      name: '/opsx:sync',
      description: '将某个 change 的 delta spec 合并进主 spec，而不归档该 change。',
      example: '/opsx:sync',
    },
    {
      name: '/opsx:archive',
      description: '归档已完成的 change，完成收尾并移入归档目录。',
      example: '/opsx:archive',
    },
  ],
};
