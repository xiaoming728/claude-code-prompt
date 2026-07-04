---
id: narrow-the-scope-of
sdlc: build
cat: Steer
roles: []
prompt: |
  改动太多了。只保留对 {scope} 的改动，撤销你的其他修改
slots:
  scope: "src/forms/ 中的校验逻辑"
src: best-practices
title: 收窄一处改动的范围
teaches: |
  当方向对了但改动铺得太开时，让 Claude 保留其中一部分，而不是把一切都回退掉。划定一条边界，能让一处小修不至于演变成一场重构。
---
