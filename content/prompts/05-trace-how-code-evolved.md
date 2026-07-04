---
id: trace-how-code-evolved
sdlc: discover
cat: Understand
roles: []
prompt: |
  查看 {path} 的提交历史，总结它是如何演变的、以及背后的原因
slots:
  path: "internal/auth/session.go"
src: best-practices
title: 追溯代码是如何演变的
teaches: |
  当问题是"为什么"而非"是什么"时，把目光投向提交历史。Claude 会读取你所用版本控制系统的日志和 blame，并解释当前实现背后的决策。
---
