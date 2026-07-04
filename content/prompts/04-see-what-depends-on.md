---
id: see-what-depends-on
sdlc: discover
cat: Understand
roles: []
prompt: |
  如果我删除 {target}，会破坏什么？
slots:
  target: "retryWithBackoff 这个辅助函数"
src: workflows
title: 删除前先检查会破坏什么
teaches: |
  在删除任何东西之前先问一问。调用方及下游影响的清单会告诉你，这究竟是一行代码的清理，还是一处需要协调的改动。
---
