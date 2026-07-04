---
id: draft-a-spec-by
sdlc: design
cat: Plan
roles: ['pm']
prompt: |
  我想构建 {feature}。就实现方式、用户体验、边界情况和权衡对我进行访谈，直到我们覆盖了所有要点，然后把规格说明写入 SPEC.md
slots:
  feature: "按工作区隔离的速率限制"
nextHref: /en/skills
src: best-practices
title: 通过访谈来起草规格说明
teaches: |
  让 Claude 来访谈你，而不是自己动手写规格说明。Claude 会有条理地向你提问，直到需求完整，然后把结果写入文件。
next: |
  把你的访谈问题保存为一个 `/spec` 技能，让每份规格说明都以同样的方式开始。
---
