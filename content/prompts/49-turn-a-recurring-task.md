---
id: turn-a-recurring-task
sdlc: operate
cat: Automate
roles: []
prompt: |
  为这个项目创建一个 /{name} 技能，用来 {steps}
slots:
  name: "ship"
  steps: "运行 linter 和测试，然后起草一条提交信息"
src: workflows
title: 把一项重复任务变成一个技能
teaches: |
  把步骤说明一次，之后就能当成一条命令反复使用。Claude 会写出一个 [技能](/en/skills)，团队里任何人都能运行。
---
