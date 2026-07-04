import type { SectionContent } from '../../types.js';

export const eccContent: SectionContent = {
  id: 'ecc',
  label: 'ECC',
  repoUrl: 'https://github.com/affaan-m/ecc',
  intro:
    'ECC 是一套面向 AI 编程 agent 的"harness 性能优化系统"，定位是 Claude Code 及其他 agent harness（如 Cursor、OpenCode、Codex、GitHub Copilot 等）的可安装插件与配置集合。它不只是配置文件，而是包含 agents、skills、hooks、rules、MCP 配置和历史命令 shim 在内的完整体系，覆盖功能规划、TDD 开发、代码评审、安全扫描、持续学习（instinct）和多 agent 编排等工作流，用于提升日常 agentic 开发的效率与可靠性。该项目源自作者 10 个多月的真实产品开发实践，以 Claude Code 插件为主要发行形式，同时兼容多种 harness。',
  install: [
    {
      name: '/plugin marketplace add',
      description: '把 ECC 仓库添加为 Claude Code 的插件市场来源。',
      example: '/plugin marketplace add https://github.com/affaan-m/ECC',
    },
    {
      name: '/plugin install ecc@ecc',
      description: '从已添加的市场安装 ECC 插件，获得全部命令、agents、skills 和 hooks。',
      example: '/plugin install ecc@ecc',
    },
    {
      name: './install.sh --profile',
      description: '通过手动安装脚本按 profile（如 minimal、full）安装 ECC 的 agents、skills、hooks 和 rules。',
      example: './install.sh --profile minimal --target claude',
    },
  ],
  skills: [
    {
      name: '/skill-create',
      description: '基于本地 git 历史分析当前仓库并生成 SKILL.md，可选同时生成 continuous-learning-v2 所需的 instinct。',
      example: '/skill-create --instincts',
    },
  ],
  usage: [
    {
      name: '/ecc:plan',
      description: '功能规划命令，由 planner agent 生成实现蓝图（插件安装后的命名空间形式）。',
      example: '/ecc:plan "{description}"',
      slots: { description: 'Add user authentication with OAuth' },
    },
    {
      name: '/code-review',
      description: '对当前改动进行代码质量与安全性评审，由 code-reviewer agent 执行。',
      example: '/code-review',
    },
    {
      name: '/build-fix',
      description: '诊断并修复构建错误，由 build-error-resolver agent 处理。',
      example: '/build-fix',
    },
    {
      name: '/security-scan',
      description: '基于 AgentShield 对 CLAUDE.md、settings.json、MCP 配置、hooks 和 agent 定义做安全审计。',
      example: '/security-scan',
    },
    {
      name: '/refactor-clean',
      description: '清理死代码，由 refactor-cleaner agent 执行。',
      example: '/refactor-clean',
    },
    {
      name: '/test-coverage',
      description: '检查测试覆盖率，用于确认改动是否达到验证标准。',
      example: '/test-coverage',
    },
    {
      name: '/instinct-status',
      description: '查看 continuous-learning-v2 系统中已学习到的 instinct（带置信度）。',
      example: '/instinct-status',
    },
    {
      name: '/instinct-import',
      description: '从文件导入他人分享的 instinct 集合。',
      example: '/instinct-import {file}',
      slots: { file: 'shared-instincts.json' },
    },
    {
      name: '/instinct-export',
      description: '导出当前会话学习到的 instinct，便于分享给他人。',
      example: '/instinct-export',
    },
    {
      name: '/evolve',
      description: '将相关的 instinct 聚类并演化为可复用的 skill。',
      example: '/evolve',
    },
    {
      name: 'npx ecc consult',
      description: '在任意项目中查询与关键词匹配的 ECC 组件（profile、skill 等），返回预览与安装命令。',
      example: 'npx ecc consult "{keyword}" --target claude',
      slots: { keyword: 'security reviews' },
    },
    {
      name: 'npx ecc-agentshield scan',
      description: '独立运行 AgentShield 安全扫描工具，可用 --fix 自动修复安全问题，或用 --opus --stream 启用三 Agent 深度分析。',
      example: 'npx ecc-agentshield scan --fix',
    },
    {
      name: 'node scripts/ecc.js doctor',
      description: '诊断本地 ECC 安装状态是否存在问题，配合 list-installed 和 repair 使用。',
      example: 'node scripts/ecc.js doctor',
    },
    {
      name: 'node scripts/uninstall.js',
      description: '卸载 ECC 管理的文件；先用 --dry-run 预览将被删除的内容，确认无误后再正式执行。',
      example: 'node scripts/uninstall.js --dry-run',
    },
  ],
};
