---
id: diagnose-from-a-console
sdlc: operate
cat: Incident
roles: ['ops', 'data']
prompt: |
  这是 {console} 的截图。给我讲讲 {resource} 为什么会失败，并给出修复它的具体命令
slots:
  console: "GCP Kubernetes 控制台"
  resource: "这个 pod"
paste: screenshot
src: teams
title: 依据控制台截图做诊断
teaches: |
  云控制台会把问题呈现给你，却不会给出修复它的命令。Claude 会读取截图，把仪表盘翻译成可执行的 kubectl、gcloud 或 aws 命令。
---
