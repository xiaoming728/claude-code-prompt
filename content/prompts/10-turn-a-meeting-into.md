---
id: turn-a-meeting-into
sdlc: design
cat: Plan
roles: ['pm']
prompt: |
  read {input} and write up the action items, then create a {tracker} ticket for each with acceptance criteria
slots:
  input: "@meeting-notes.md"
  tracker: "Linear"
needs: tracker
nextHref: /en/skills
src: teams
title: 把会议变成工单
teaches: |
  跳过整理记录这一步。Claude 会从无结构的输入中提取行动项，并通过 [MCP](/en/mcp) 直接写入你的工单系统，这样你审阅的是工单，而不是会议记录。
next: |
  把它保存为一个 `/tickets` 技能。
---
