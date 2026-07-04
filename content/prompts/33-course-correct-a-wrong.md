---
id: course-correct-a-wrong
sdlc: build
cat: Steer
roles: []
prompt: |
  that is not right: {feedback}. try a different approach
slots:
  feedback: "the function signature needs to stay backward-compatible"
nextHref: /en/checkpointing
src: best-practices
title: 纠正走错方向的做法
teaches: |
  指出 Claude 漏掉的那个约束，而不只是说它错了。一个具体的原因，能在重试时给 Claude 一个明确要满足的约束，而不是让它再猜一遍。
next: |
  连按两次 `Esc` 打开回退菜单，恢复代码与对话，让重试从干净的状态开始。
---
