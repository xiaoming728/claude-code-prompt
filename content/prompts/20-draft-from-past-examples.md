---
id: draft-from-past-examples
sdlc: build
cat: Implement
roles: ['docs', 'marketing', 'pm']
prompt: |
  阅读 {folder} 里的 {examples}，学习其结构和语气，然后为 {topic} 起草一份新的
slots:
  examples: "隐私影响评估报告"
  folder: "legal/pia/"
  topic: "新的分析功能集成"
nextHref: /en/skills
src: legal
title: 参照过往范例起草文档
teaches: |
  指向一个装着已完成作品的文件夹，而不是去描述你的风格。Claude 会从你已交付的成果中学习其结构与语气，让初稿读起来就像出自你之手。
next: |
  把这种语气保存为一个技能，让每份草稿都以它作为起点。
---
