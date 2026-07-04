---
id: work-an-issue-end
sdlc: build
cat: Implement
roles: []
prompt: |
  读取 issue #{issue}，实现修复，并运行测试
slots:
  issue: "312"
needs: gh
src: workflows
title: 端到端处理一个 issue
teaches: |
  给出 issue 编号，而不是一段摘要。Claude 会自己读完整个工单，这样你可能忘记提及的需求也能传达到位，而且它会在汇报之前先验证改动。
---
