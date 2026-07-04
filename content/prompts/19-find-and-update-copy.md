---
id: find-and-update-copy
sdlc: build
cat: Implement
roles: ['design', 'docs', 'marketing']
prompt: |
  find every place we say "{copy}" or a close variant, show me each one in context, then update them all to "{new}". leave tests and the changelog alone
slots:
  copy: "Sign up free"
  new: "Start free trial"
src: teams
title: 在整个代码库中查找并更新文案
teaches: |
  让它连同各种变体一起找，并说明要跳过什么。Claude 能找到逐字搜索会遗漏的表述，同时不动测试夹具和历史记录，这样你只需审阅用户真正看到的文案。
---
