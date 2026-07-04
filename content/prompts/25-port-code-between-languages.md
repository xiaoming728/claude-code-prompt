---
id: port-code-between-languages
sdlc: build
cat: Refactor
roles: []
prompt: |
  把 {source} 移植到 {target}，保持相同的 {keep}
slots:
  source: "这个 Python 模块"
  target: "Rust"
  keep: "公共 API 和测试行为"
src: teams
title: 把代码移植到另一种语言
teaches: |
  说明要保留什么，而不只是目标语言。指明必须保持不变的 API 或行为，就等于给了 Claude 一份用来校验移植结果的契约。
---
