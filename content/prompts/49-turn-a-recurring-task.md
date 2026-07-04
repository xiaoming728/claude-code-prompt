---
id: turn-a-recurring-task
sdlc: operate
cat: Automate
roles: []
prompt: |
  create a /{name} skill for this project that {steps}
slots:
  name: "ship"
  steps: "runs the linter and tests, then drafts a commit message"
src: workflows
title: 把一项重复任务变成一个技能
teaches: |
  把步骤说明一次，之后就能当成一条命令反复使用。Claude 会写出一个 [技能](/en/skills)，团队里任何人都能运行。
---
