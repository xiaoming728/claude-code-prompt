import type { SectionContent } from '../../types.js';

export const eccContent: SectionContent = {
  id: 'ecc',
  label: 'ECC',
  repoUrl: 'https://github.com/affaan-m/ecc',
  intro:
    'ECC 是一套面向 AI 编程 agent 的 harness 性能优化系统，以 Claude Code 插件为主要发行形式，同时兼容 Cursor、OpenCode、Codex、GitHub Copilot 等多种 agent harness。它打包了 agents、skills、hooks、rules、MCP 配置和历史命令 shim，覆盖功能规划、TDD 开发、代码评审、安全扫描、持续学习（instinct）和多 agent 编排等工作流，用于提升日常 agentic 开发的效率与可靠性。项目源自作者 10 个多月的真实产品开发实践。',
  install: [
    {
      name: '/plugin marketplace add',
      description: '将 ECC 仓库添加为 Claude Code 的插件市场来源。',
      example: '/plugin marketplace add https://github.com/affaan-m/ECC',
    },
    {
      name: '/plugin install ecc@ecc',
      description: '从已添加的市场安装 ECC 插件，获取全部 commands、agents、skills 和 hooks。',
      example: '/plugin install ecc@ecc',
    },
    {
      name: './install.sh --profile',
      description: '按 profile（minimal/core/full）用安装脚本部署 ECC 的 agents、skills、hooks 和 rules。',
      example: './install.sh --profile minimal --target claude',
    },
  ],
  skills: [
    {
      name: '/security-scan',
      description: '对 agent、hook、MCP、权限和密钥暴露面运行 AgentShield 扫描，输出分级修复清单，加 --fix 可自动修复标记为安全的问题。',
      example: '/security-scan',
    },
  ],
  usage: [
    {
      name: '/ecc:plan',
      description: '在动手写代码前生成分阶段实现方案，由 planner agent 产出并等待你确认后才继续。',
      example: '/ecc:plan "{description}"',
      slots: { description: 'Add user authentication with OAuth' },
    },
    {
      name: '/code-review',
      description: '由 code-reviewer agent 对本地改动或 GitHub PR 做代码质量与安全评审，CRITICAL/HIGH 问题作为阻断项。',
      example: '/code-review',
    },
    {
      name: '/build-fix',
      description: '由 build-error-resolver agent 自动检测构建工具，逐个用最小改动修复构建与类型错误。',
      example: '/build-fix',
    },
    {
      name: '/refactor-clean',
      description: '由 refactor-cleaner agent 检测死代码，逐项删除并在每次删除后跑测试验证。',
      example: '/refactor-clean',
    },
    {
      name: '/test-coverage',
      description: '分析测试覆盖率缺口并生成补充测试，目标覆盖率 80% 以上。',
      example: '/test-coverage',
    },
    {
      name: '/instinct-status',
      description: '查看项目与全局范围内已学习到的 instinct 及其置信度。',
      example: '/instinct-status',
    },
    {
      name: '/instinct-import',
      description: '从文件或 URL 导入他人分享的 instinct 集合。',
      example: '/instinct-import {file}',
      slots: { file: 'team-instincts.yaml' },
    },
    {
      name: '/instinct-export',
      description: '将项目或全局范围内已学习到的 instinct 导出为可分享的 YAML 文件。',
      example: '/instinct-export',
    },
    {
      name: '/evolve',
      description: '分析 instinct 之间的关联，演化为可复用的 command、skill 或 agent。',
      example: '/evolve',
    },
    {
      name: '/skill-create',
      description: '分析本地 git 历史提取编码规范并生成 SKILL.md，加 --instincts 可同时生成 continuous-learning-v2 所需的 instinct。',
      example: '/skill-create --instincts',
    },
    {
      name: 'npx ecc consult',
      description: '按关键词在 ECC 组件库中查询匹配的 profile、skill 等，返回预览与安装命令。',
      example: 'npx ecc consult "{keyword}" --target claude',
      slots: { keyword: 'security reviews' },
    },
    {
      name: 'npx ecc-agentshield scan',
      description: '独立运行 AgentShield 安全扫描；--fix 自动修复安全问题，--opus --stream 启用 Red/Blue/Auditor 三 agent 深度分析。',
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
