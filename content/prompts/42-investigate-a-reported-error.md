---
id: investigate-a-reported-error
sdlc: operate
cat: Debug
roles: ['ops']
prompt: |
  users are seeing {symptom} on {where}. investigate and tell me what is going on
slots:
  symptom: "500 errors"
  where: "/api/settings"
nextHref: /en/web-quickstart#pre-fill-sessions
src: workflows
title: 排查一个被上报的错误
teaches: |
  描述症状和发生位置；Claude 会读取相关的代码路径并追溯可能的原因。如果你有堆栈跟踪或日志，就一并粘贴进来。
next: |
  在你的运维手册里放一个深链接，点开即以这条提示词预填好的方式启动 Claude。
---
