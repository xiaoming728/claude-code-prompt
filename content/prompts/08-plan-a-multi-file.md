---
id: plan-a-multi-file
sdlc: design
cat: Plan
roles: ['pm', 'design']
prompt: |
  plan how to refactor the {target} to {goal}. list the files you would change, but don't edit anything yet
slots:
  target: "payment module"
  goal: "support multiple currencies"
src: workflows
title: 动代码前先规划跨文件改动
teaches: |
  加上"先别改动"这句话，能把探索与改动分开，让你在任何代码变动之前先看到方案。若想让"先规划"成为每次提问的默认行为，按 Shift+Tab 进入 [规划模式](/en/permission-modes#analyze-before-you-edit-with-plan-mode)。
---
