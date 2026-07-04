---
id: plan-a-multi-file
sdlc: design
cat: Plan
roles: ['pm', 'design']
prompt: |
  规划一下如何重构 {target} 以实现 {goal}。列出你会改动的文件，但先不要动手改
slots:
  target: "支付模块"
  goal: "支持多币种"
src: workflows
title: 动代码前先规划跨文件改动
teaches: |
  加上"先别改动"这句话，能把探索与改动分开，让你在任何代码变动之前先看到方案。若想让"先规划"成为每次提问的默认行为，按 Shift+Tab 进入 [规划模式](/en/permission-modes#analyze-before-you-edit-with-plan-mode)。
---
