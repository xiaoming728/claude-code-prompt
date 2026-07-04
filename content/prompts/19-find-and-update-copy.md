---
id: find-and-update-copy
sdlc: build
cat: Implement
roles: ['design', 'docs', 'marketing']
prompt: |
  找出所有写着"{copy}"或近似说法的地方，把每一处连同上下文展示给我，然后把它们全部改成"{new}"。测试和更新日志不要动
slots:
  copy: "Sign up free"
  new: "Start free trial"
src: teams
title: 在整个代码库中查找并更新文案
teaches: |
  让它连同各种变体一起找，并说明要跳过什么。Claude 能找到逐字搜索会遗漏的表述，同时不动测试夹具和历史记录，这样你只需审阅用户真正看到的文案。
---
