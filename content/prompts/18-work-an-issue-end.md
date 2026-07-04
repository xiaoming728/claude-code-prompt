---
id: work-an-issue-end
sdlc: build
cat: Implement
roles: []
prompt: |
  read issue #{issue}, implement the fix, and run the tests
slots:
  issue: "312"
needs: gh
src: workflows
title: 端到端处理一个 issue
teaches: |
  给出 issue 编号，而不是一段摘要。Claude 会自己读完整个工单，这样你可能忘记提及的需求也能传达到位，而且它会在汇报之前先验证改动。
---
