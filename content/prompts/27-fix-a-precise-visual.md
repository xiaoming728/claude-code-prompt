---
id: fix-a-precise-visual
sdlc: build
cat: Refactor
roles: ['design']
prompt: |
  {element} 在 {viewport} 上超出了 {container} 达 {amount}。修复它。
slots:
  element: "登录按钮"
  amount: "20px"
  container: "卡片边框"
  viewport: "移动端"
nextHref: /en/desktop#preview-your-app
src: ebook
title: 修复一处精确的视觉 bug
teaches: |
  精确的视觉反馈才能换来精确的修复。说明确切的元素、尺寸和视口。
next: |
  加上一个预览工具，让 Claude 自己截图并验证修复。
---
