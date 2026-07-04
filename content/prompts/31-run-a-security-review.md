---
id: run-a-security-review
sdlc: build
cat: Review
roles: ['security']
prompt: |
  use a subagent to review {path} for security issues and report what it finds
slots:
  path: "src/api/"
nextHref: /en/sub-agents
src: best-practices
title: 用子智能体做一次安全审查
teaches: |
  [子智能体](/en/sub-agents)会在它自己的上下文窗口里执行审计并回传一份总结，这样一次冗长的安全审查就不会占满你的主会话。内置的通用子智能体无需额外配置即可胜任。
next: |
  搭建一个专用的安全审查子智能体，供整个团队使用。
---
