---
id: connect-a-tool-with
sdlc: operate
cat: Automate
roles: []
prompt: |
  配置 {server} MCP 服务器，让你可以直接读取我的 {data}
slots:
  server: "Sentry"
  data: "错误报告"
src: workflows
title: 用 MCP 接入一个工具
teaches: |
  把数据源一次性接入，而不必每次会话都粘贴数据。配置好 [MCP](/en/mcp) 之后，当你问起时，Claude 会直接从该工具读取。
---
