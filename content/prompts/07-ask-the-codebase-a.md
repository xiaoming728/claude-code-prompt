---
id: ask-the-codebase-a
sdlc: discover
cat: Understand
roles: ['pm']
prompt: |
  我是一名{role}。给我讲讲当用户{action}时会发生什么，从界面一路讲到最终结果
slots:
  role: "产品经理"
  action: "点击「导出为 PDF」"
nextHref: /en/output-styles
src: teams
title: 向代码库提一个产品问题
teaches: |
  说明你的角色，好让回答落在合适的层次。Claude 会从源代码出发讲清楚产品实际做了什么，你无需自己去读代码。
next: |
  设置一个输出风格，让 Claude 始终把回答落在这个层次上。
---
