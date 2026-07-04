---
id: ask-the-codebase-a
sdlc: discover
cat: Understand
roles: ['pm']
prompt: |
  I am a {role}. walk me through what happens when a user {action}, from the UI down to the result
slots:
  role: "PM"
  action: "clicks Export to PDF"
nextHref: /en/output-styles
src: teams
title: 向代码库提一个产品问题
teaches: |
  说明你的角色，好让回答落在合适的层次。Claude 会从源代码出发讲清楚产品实际做了什么，你无需自己去读代码。
next: |
  设置一个输出风格，让 Claude 始终把回答落在这个层次上。
---
