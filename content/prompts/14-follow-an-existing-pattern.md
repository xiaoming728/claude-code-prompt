---
id: follow-an-existing-pattern
sdlc: build
cat: Implement
roles: []
prompt: |
  look at how {example} is implemented to understand the pattern, then build {new} the same way
slots:
  example: "the GitHub webhook handler"
  new: "a Stripe webhook handler"
nextHref: /en/memory
src: best-practices
title: 沿用已有的模式
teaches: |
  指向你已经认可的代码。没有参照时，Claude 会默认套用通用的最佳实践；有了参照，它就会贴合你代码库实际采用的约定。
next: |
  让 Claude 把它所沿用的模式写入 `CLAUDE.md`，这样以后的会话无需参照也能与之保持一致。
---
