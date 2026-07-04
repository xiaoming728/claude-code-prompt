---
id: migrate-a-pattern-across
sdlc: build
cat: Refactor
roles: []
prompt: |
  migrate everything from {from} to {to}: identify every place that needs to change, then make the changes
slots:
  from: "the old logging API"
  to: "the structured logger"
src: workflows
title: 在整个代码库中迁移一种模式
teaches: |
  描述旧的模式和新的模式。先让 Claude 找出所有涉及之处，意味着调用点会列在回复里，这样你就能核对有没有遗漏。
---
