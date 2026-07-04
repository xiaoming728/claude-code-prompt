---
id: draft-from-past-examples
sdlc: build
cat: Implement
roles: ['docs', 'marketing', 'pm']
prompt: |
  read the {examples} in {folder} to learn the structure and voice, then draft a new one for {topic}
slots:
  examples: "privacy impact assessments"
  folder: "legal/pia/"
  topic: "the new analytics integration"
nextHref: /en/skills
src: legal
title: 参照过往范例起草文档
teaches: |
  指向一个装着已完成作品的文件夹，而不是去描述你的风格。Claude 会从你已交付的成果中学习其结构与语气，让初稿读起来就像出自你之手。
next: |
  把这种语气保存为一个技能，让每份草稿都以它作为起点。
---
