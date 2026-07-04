---
id: connect-a-tool-with
sdlc: operate
cat: Automate
roles: []
prompt: |
  set up the {server} MCP server so you can read my {data} directly
slots:
  server: "Sentry"
  data: "error reports"
src: workflows
title: 用 MCP 接入一个工具
teaches: |
  把数据源一次性接入，而不必每次会话都粘贴数据。配置好 [MCP](/en/mcp) 之后，当你问起时，Claude 会直接从该工具读取。
---
