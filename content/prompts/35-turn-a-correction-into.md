---
id: turn-a-correction-into
sdlc: build
cat: Steer
roles: []
prompt: |
  you keep {mistake}. add a rule to CLAUDE.md so this stops happening
slots:
  mistake: "using default exports when this project uses named exports"
nextHref: /en/memory
src: best-practices
title: 把一次纠正变成一条规则
teaches: |
  对话里的一次纠正并不会分享给你的团队。而项目的 [CLAUDE.md](/en/memory) 里的一条规则，一经提交便会被共享，Claude 每次会话开始时都会读取它。
next: |
  打开 `/memory` 来查看 Claude 写了什么。
---
