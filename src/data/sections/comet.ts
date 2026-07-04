import type { SectionContent } from '../../types.js';

export const cometContent: SectionContent = {
  id: 'comet',
  label: 'Comet',
  repoUrl: 'https://github.com/rpamis/comet',
  intro:
    'Comet 是一个把 OpenSpec 与 Superpowers 整合为统一五阶段工作流的自动化开发框架（发行形式为 npm 包 @rpamis/comet），定位是"双星工作流"：OpenSpec 负责需求与规格的生命周期管理（"做什么"），Superpowers 负责技术设计与实施方法论（"怎么做"）。它把开发过程拆分为开启、深度设计、计划与构建、验证与收尾、归档五个自动衔接的阶段，通过 .comet.yaml 状态文件和 guard 脚本校验阶段过渡是否合法，支持中断后按检查点恢复，避免长上下文场景下的状态遗忘或跳过前置阶段。项目以 slash 命令和配套 CLI 提供入口，支持 30 余种 AI 编码平台，并包含可将 Design→Build 阶段交接 token 消耗降低 25%-30% 的上下文压缩（beta）能力。',
  install: [
    {
      name: 'npm install -g @rpamis/comet',
      description: '全局安装 Comet 命令行工具，供后续在项目中运行 comet init 等命令。',
      example: 'npm install -g @rpamis/comet',
    },
    {
      name: 'npx skills add rpamis/comet',
      description: '为使用通用 skills CLI 的平台（如 OpenClaw、Hermes）安装 Comet 技能包。',
      example: 'npx skills add rpamis/comet',
    },
    {
      name: 'comet init',
      description: '在项目中初始化 Comet 工作流，交互式选择目标 AI 平台、安装范围（项目级或全局）、技能语言，以及是否同时安装 OpenSpec、Superpowers、CodeGraph 等依赖。',
      example: 'comet init [path] [--yes] [--scope <scope>] [--language <lang>]',
    },
    {
      name: 'comet update',
      description: '在 npm 包升级后刷新已部署的技能文件，保持 slash 命令为最新版本。',
      example: 'comet update [path] [--scope <scope>] [--language <lang>]',
    },
  ],
  skills: [
    {
      name: '/comet',
      description: '五阶段工作流的主入口，自动检测当前 change 所处阶段并分发到对应子命令。',
      example: '/comet',
    },
    {
      name: '/comet-open',
      description: '阶段 1（开启）：通过 OpenSpec 提出并探索需求，创建 proposal、design、tasks 三件套。',
      example: '/comet-open',
    },
    {
      name: '/comet-design',
      description: '阶段 2（深度设计）：通过 Superpowers 的 brainstorming 产出 Design Doc 和 delta spec。',
      example: '/comet-design',
    },
    {
      name: '/comet-build',
      description: '阶段 3（计划与构建）：制定实施计划并落地代码、提交，由 Superpowers 驱动执行。',
      example: '/comet-build',
    },
    {
      name: '/comet-verify',
      description: '阶段 4（验证与收尾）：验证实现是否符合设计，生成验证报告并处理开发分支。',
      example: '/comet-verify',
    },
    {
      name: '/comet-archive',
      description: '阶段 5（归档）：按 OpenSpec delta 语义把 change 的规格变更合并进主 spec 并归档。',
      example: '/comet-archive',
    },
    {
      name: '/comet-hotfix',
      description: '预设路径：跳过 brainstorming，直接走 open → build → verify → archive，适用于不涉及新能力设计的 bug 修复。',
      example: '/comet-hotfix',
    },
    {
      name: '/comet-tweak',
      description: '预设路径：跳过 brainstorming 与完整计划，适用于文案、配置、文档等局部小改动。',
      example: '/comet-tweak',
    },
  ],
  usage: [
    {
      name: 'comet status',
      description: '查看当前项目中活跃的 change 及推荐的下一步操作。',
      example: 'comet status [path] [--json]',
    },
    {
      name: 'comet dashboard',
      description: '启动本地只读可视化仪表盘，浏览工作流状态。',
      example: 'comet dashboard [path] [--port <port>] [--no-open]',
    },
    {
      name: 'comet doctor',
      description: '诊断本地 Comet 安装是否存在问题。',
      example: 'comet doctor [path] [--scope <scope>]',
    },
    {
      name: 'comet uninstall',
      description: '安全移除 Comet 安装的技能文件、rules 和 hooks。',
      example: 'comet uninstall [path] [--force] [--scope <scope>]',
    },
  ],
};
