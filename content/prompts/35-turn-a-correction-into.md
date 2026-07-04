---
id: turn-a-correction-into
sdlc: build
cat: Steer
roles: []
prompt: |
  你一直在 {mistake}。在 CLAUDE.md 里加一条规则，让这种情况不再发生
slots:
  mistake: "在这个项目使用具名导出的情况下，还用默认导出"
nextHref: /en/memory
src: best-practices
title: 把一次纠正变成一条规则
teaches: |
  对话里的一次纠正并不会分享给你的团队。而项目的 [CLAUDE.md](/en/memory) 里的一条规则，一经提交便会被共享，Claude 每次会话开始时都会读取它。
next: |
  打开 `/memory` 来查看 Claude 写了什么。
---
