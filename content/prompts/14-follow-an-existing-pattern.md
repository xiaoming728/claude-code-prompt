---
id: follow-an-existing-pattern
sdlc: build
cat: Implement
roles: []
prompt: |
  看看 {example} 是怎么实现的，理解它的模式，然后用同样的方式构建 {new}
slots:
  example: "GitHub webhook 处理器"
  new: "一个 Stripe webhook 处理器"
nextHref: /en/memory
src: best-practices
title: 沿用已有的模式
teaches: |
  指向你已经认可的代码。没有参照时，Claude 会默认套用通用的最佳实践；有了参照，它就会贴合你代码库实际采用的约定。
next: |
  让 Claude 把它所沿用的模式写入 `CLAUDE.md`，这样以后的会话无需参照也能与之保持一致。
---
