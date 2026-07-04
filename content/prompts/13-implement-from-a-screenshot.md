---
id: implement-from-a-screenshot
sdlc: design
cat: Prototype
roles: ['design']
prompt: |
  implement this design, then take a screenshot of the result, compare it to the original, and fix any differences
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
