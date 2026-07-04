---
id: add-a-small-well
sdlc: build
cat: Implement
roles: []
prompt: |
  add a {endpoint} endpoint that returns {payload}
slots:
  endpoint: "/health"
  payload: "the app version and uptime"
src: workflows
title: 添加一个小而明确的功能
teaches: |
  说明输入和输出，而不是怎么去实现。Claude 会找到类似代码所在的位置，并把你的代码添加在它旁边。
---
