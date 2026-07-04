---
id: optimize-against-a-measurable
sdlc: build
cat: Refactor
roles: ['data']
prompt: |
  优化 {target}，把 {metric} 从 {current} 降到 {goal} 以下
slots:
  target: "搜索查询"
  metric: "p95 延迟"
  current: "2s"
  goal: "500ms"
nextHref: /en/goal
src: ebook
title: 对着可衡量的目标做优化
teaches: |
  说清楚指标和目标，就为 Claude 给出了明确的"完成"定义。
next: |
  把它设为一个 `/goal`，让 Claude 持续测量并迭代，直到达到那个数值。
---
