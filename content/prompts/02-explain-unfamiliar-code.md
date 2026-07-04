---
id: explain-unfamiliar-code
sdlc: discover
cat: Understand
roles: []
prompt: |
  解释一下 {path} 是做什么的、数据是如何在其中流转的，然后把结果写成 {format}
slots:
  path: "src/scheduler/queue.ts"
  format: "一个带图表的 HTML 页面，然后在浏览器里打开它"
nextHref: /en/output-styles
src: workflows
title: 讲解陌生的代码
teaches: |
  指明文件，并说明你想要什么格式的回答。可以把 HTML 页面换成图表、要点列表，或任何适合你学习方式的形式。
next: |
  设置一个输出风格，让 Claude 始终以你偏好的格式来讲解。
---
