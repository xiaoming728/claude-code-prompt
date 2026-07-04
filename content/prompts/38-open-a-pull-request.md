---
id: open-a-pull-request
sdlc: ship
cat: Git
roles: []
prompt: |
  找到 {tracker} 里关于 {topic} 的工单，然后发起一个实现它的 PR
slots:
  tracker: "Linear"
  topic: "登录超时问题"
needs: tracker
src: workflows
title: 从一个工单发起 pull request
teaches: |
  省去在工单系统、编辑器和 GitHub 之间来回切换。一条提示词就能读取规格、做出改动并发起 PR。
---
