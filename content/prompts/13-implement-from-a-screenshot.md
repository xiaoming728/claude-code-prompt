---
id: implement-from-a-screenshot
sdlc: design
cat: Prototype
roles: ['design']
prompt: |
  实现这个设计，然后给结果截图，和原图对比，修复任何差异
needs: browser
paste: design
nextHref: /en/goal
src: best-practices
title: 依据截图实现并自我校验
teaches: |
  这为 Claude 提供了一个验证循环：它会渲染、与原始图像对比，并不断迭代，无需你逐一指出每一处差异。
next: |
  使用 `/goal` 让 Claude 持续迭代，直到截图相互吻合。
---
