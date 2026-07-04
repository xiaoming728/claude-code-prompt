---
id: add-a-small-well
sdlc: build
cat: Implement
roles: []
prompt: |
  添加一个 {endpoint} 接口，返回 {payload}
slots:
  endpoint: "/health"
  payload: "应用版本号和运行时长"
src: workflows
title: 添加一个小而明确的功能
teaches: |
  说明输入和输出，而不是怎么去实现。Claude 会找到类似代码所在的位置，并把你的代码添加在它旁边。
---
