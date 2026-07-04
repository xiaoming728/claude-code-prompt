---
id: generate-variations-from-performance
sdlc: operate
cat: Data
roles: ['marketing', 'data']
prompt: |
  read {file}, find the underperforming {items}, and generate {n} new variations that stay under {limit} characters
slots:
  file: "@ads-performance.csv"
  items: "headlines"
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
