---
id: optimize-against-a-measurable
sdlc: build
cat: Refactor
roles: ['data']
prompt: |
  optimize {target} to bring {metric} from {current} down to under {goal}
slots:
  target: "the search query"
  metric: "p95 latency"
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
