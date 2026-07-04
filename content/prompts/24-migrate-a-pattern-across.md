---
id: migrate-a-pattern-across
sdlc: build
cat: Refactor
roles: []
prompt: |
  把所有内容从 {from} 迁移到 {to}：先找出每一处需要修改的地方，然后再进行修改
slots:
  from: "旧的日志 API"
  to: "结构化日志记录器"
src: workflows
title: 在整个代码库中迁移一种模式
teaches: |
  描述旧的模式和新的模式。先让 Claude 找出所有涉及之处，意味着调用点会列在回复里，这样你就能核对有没有遗漏。
---
