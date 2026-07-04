---
id: draft-a-spec-by
sdlc: design
cat: Plan
roles: ['pm']
prompt: |
  I want to build {feature}. interview me about implementation, UX, edge cases, and tradeoffs until we have covered everything, then write the spec to SPEC.md
slots:
  feature: "per-workspace rate limits"
nextHref: /en/skills
src: best-practices
title: 通过访谈来起草规格说明
teaches: |
  让 Claude 来访谈你，而不是自己动手写规格说明。Claude 会有条理地向你提问，直到需求完整，然后把结果写入文件。
next: |
  把你的访谈问题保存为一个 `/spec` 技能，让每份规格说明都以同样的方式开始。
---
