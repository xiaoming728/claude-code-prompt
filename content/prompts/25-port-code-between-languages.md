---
id: port-code-between-languages
sdlc: build
cat: Refactor
roles: []
prompt: |
  port {source} to {target}, keeping the same {keep}
slots:
  source: "this Python module"
  target: "Rust"
  keep: "public API and test behavior"
src: teams
title: 把代码移植到另一种语言
teaches: |
  说明要保留什么，而不只是目标语言。指明必须保持不变的 API 或行为，就等于给了 Claude 一份用来校验移植结果的契约。
---
