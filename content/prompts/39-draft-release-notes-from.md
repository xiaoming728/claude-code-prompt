---
id: draft-release-notes-from
sdlc: ship
cat: Release
roles: ['pm', 'docs', 'marketing']
prompt: |
  对比 {from} 和 {to}，起草一份按新功能、修复和破坏性变更分类的发布说明
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
