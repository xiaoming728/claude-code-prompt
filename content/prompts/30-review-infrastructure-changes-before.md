---
id: review-infrastructure-changes-before
sdlc: build
cat: Review
roles: ['security', 'ops']
prompt: |
  here is my Terraform plan output. what is this going to do, and is anything here going to cause problems?
paste: plan
src: teams
title: 应用前先审查基础设施改动
teaches: |
  plan 的输出密密麻麻、难以快速浏览。把它粘贴进来，就能在应用之前得到一份用大白话说明究竟会改动什么的总结。
---
