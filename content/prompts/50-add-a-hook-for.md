---
id: add-a-hook-for
sdlc: operate
cat: Automate
roles: []
prompt: |
  写一个 hook，在每次 {event} 之后 {action}
slots:
  action: "运行 prettier"
  event: "编辑 .ts 或 .tsx 文件"
src: best-practices
title: 为重复行为添加一个 hook
teaches: |
  Hook 能让某种行为自动发生，而不必你每次都记着去要求。描述触发条件和动作，Claude 就会写出 [hook](/en/hooks) 配置。
---
