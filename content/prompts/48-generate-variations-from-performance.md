---
id: generate-variations-from-performance
sdlc: operate
cat: Data
roles: ['marketing', 'data']
prompt: |
  读取 {file}，找出表现不佳的 {items}，生成 {n} 个不超过 {limit} 个字符的新变体
slots:
  file: "@ads-performance.csv"
  items: "标题"
  n: "20"
  limit: "90"
paste: csv
nextHref: /en/mcp
src: teams
title: 依据表现数据生成多个变体
teaches: |
  一开始就说明约束，好让生成过程始终不越界。Claude 会读取指标、挑出要替换的部分，并产出符合要求的替代方案。
next: |
  通过 MCP 接入广告平台，而不是导出文件。
---
