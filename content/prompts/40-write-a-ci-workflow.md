---
id: write-a-ci-workflow
sdlc: ship
cat: Release
roles: ['ops']
prompt: |
  写一个 GitHub Actions 工作流，在每次推送到 {branch} 时 {steps}
slots:
  steps: "运行测试并部署到预发布环境"
  branch: "main"
src: workflows
title: 编写一个 CI 工作流
teaches: |
  描述它应该在何时运行、应该做什么；YAML 会为你生成，并与你项目的构建和测试命令相匹配。
---
