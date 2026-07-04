---
id: open-a-pull-request
sdlc: ship
cat: Git
roles: []
prompt: |
  find the {tracker} ticket about {topic} and open a PR that implements it
slots:
  tracker: "Linear"
  topic: "the login timeout"
needs: tracker
src: workflows
title: 从一个工单发起 pull request
teaches: |
  省去在工单系统、编辑器和 GitHub 之间来回切换。一条提示词就能读取规格、做出改动并发起 PR。
---
