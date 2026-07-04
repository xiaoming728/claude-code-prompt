---
id: write-a-ci-workflow
sdlc: ship
cat: Release
roles: ['ops']
prompt: |
  write a GitHub Actions workflow that {steps} on every push to {branch}
slots:
  steps: "runs the tests and deploys to staging"
  branch: "main"
src: workflows
title: 编写一个 CI 工作流
teaches: |
  描述它应该在何时运行、应该做什么；YAML 会为你生成，并与你项目的构建和测试命令相匹配。
---
