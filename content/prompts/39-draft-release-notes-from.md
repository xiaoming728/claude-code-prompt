---
id: draft-release-notes-from
sdlc: ship
cat: Release
roles: ['pm', 'docs', 'marketing']
prompt: |
  compare {from} to {to} and draft release notes grouped by feature, fix, and breaking change
slots:
  from: "v2.3.0"
  to: "v2.4.0"
nextHref: /en/skills
src: workflows
title: 依据 git 历史起草发布说明
teaches: |
  给出两个参照点以及你想要的结构。Claude 会读取两者之间的提交日志，并起草一份你可以编辑的更新日志。
next: |
  把它保存为一个 `/changelog` 技能。
---
