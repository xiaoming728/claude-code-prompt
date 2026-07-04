---
id: add-a-hook-for
sdlc: operate
cat: Automate
roles: []
prompt: |
  write a hook that {action} after every {event}
slots:
  action: "runs prettier"
  event: "edit to a .ts or .tsx file"
src: best-practices
title: 为重复行为添加一个 hook
teaches: |
  Hook 能让某种行为自动发生，而不必你每次都记着去要求。描述触发条件和动作，Claude 就会写出 [hook](/en/hooks) 配置。
---
