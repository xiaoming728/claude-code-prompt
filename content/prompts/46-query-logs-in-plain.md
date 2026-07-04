---
id: query-logs-in-plain
sdlc: operate
cat: Incident
roles: ['security', 'ops', 'data']
prompt: |
  给我看 {scope} 在 {timeframe} 内的所有 {events}。写出查询语句，运行它，并告诉我有什么异常
slots:
  events: "登录失败记录"
  scope: "认证服务"
  timeframe: "过去 24 小时"
needs: db
src: cybersecurity
title: 用大白话查询日志
teaches: |
  直接提问，而不是自己写 SQL。Claude 会构造查询、在你接入的日志上运行，并把查询语句和结果一并展示，方便你核对到底跑了什么。
---
