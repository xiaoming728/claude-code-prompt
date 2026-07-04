---
id: diagnose-from-a-console
sdlc: operate
cat: Incident
roles: ['ops', 'data']
prompt: |
  here is a screenshot of {console}. walk me through why {resource} is failing and give me the exact commands to fix it
slots:
  console: "the GCP Kubernetes dashboard"
  resource: "this pod"
paste: screenshot
src: teams
title: 依据控制台截图做诊断
teaches: |
  云控制台会把问题呈现给你，却不会给出修复它的命令。Claude 会读取截图，把仪表盘翻译成可执行的 kubectl、gcloud 或 aws 命令。
---
