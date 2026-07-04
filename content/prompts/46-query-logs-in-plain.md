---
id: query-logs-in-plain
sdlc: operate
cat: Incident
roles: ['security', 'ops', 'data']
prompt: |
  show me all {events} for {scope} over {timeframe}. write the query, run it, and tell me what stands out
slots:
  events: "failed logins"
  scope: "the auth service"
  timeframe: "the past 24 hours"
needs: db
src: cybersecurity
title: 用大白话查询日志
teaches: |
  直接提问，而不是自己写 SQL。Claude 会构造查询、在你接入的日志上运行，并把查询语句和结果一并展示，方便你核对到底跑了什么。
---
