---
id: see-what-depends-on
sdlc: discover
cat: Understand
roles: []
prompt: |
  what would break if I deleted {target}?
slots:
  target: "the retryWithBackoff helper"
src: workflows
title: 删除前先检查会破坏什么
teaches: |
  在删除任何东西之前先问一问。调用方及下游影响的清单会告诉你，这究竟是一行代码的清理，还是一处需要协调的改动。
---
