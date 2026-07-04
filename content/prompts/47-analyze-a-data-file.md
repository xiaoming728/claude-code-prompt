---
id: analyze-a-data-file
sdlc: operate
cat: Data
roles: ['data', 'pm', 'marketing']
prompt: |
  read {file}, summarize the key patterns, and write the results to {output}
slots:
  file: "@reports/q1-signups.csv"
  output: "an HTML page with charts, then open it in my browser"
paste: csv
nextHref: /en/mcp
src: teams
title: 分析一个数据文件
teaches: |
  一次性的问题不需要一个一次性的脚本。指向你项目文件夹里的某个文件，Claude 会直接读取它、找出其中的规律，并把结果写到你指定的地方。
next: |
  通过 MCP 接入数据源，而不是导出文件。
---
