---
id: investigate-a-production-incident
sdlc: operate
cat: Incident
roles: ['ops', 'security']
prompt: |
  {symptom}. check the logs, recent deploys, and config changes, then tell me the most likely cause
slots:
  symptom: "the checkout endpoint started returning 500s an hour ago"
nextHref: /en/mcp
src: workflows
title: 排查一起生产环境事故
teaches: |
  列出要相互印证的证据来源，而不是要执行的步骤。Claude 会把日志、git 历史和配置放在一起读取，从而缩小原因范围。
next: |
  通过 MCP 接入 Sentry 或你的日志存储。
---
