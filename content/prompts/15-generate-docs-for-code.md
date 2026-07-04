---
id: generate-docs-for-code
sdlc: build
cat: Implement
roles: ['docs']
prompt: |
  找出 {scope} 中缺少 {format} 注释的部分并补上，风格要和文件里已有的保持一致
slots:
  scope: "src/auth/ 中的公共函数"
  format: "JSDoc"
src: workflows
title: 为缺少文档的代码生成文档
teaches: |
  指明范围和格式。Claude 会找出缺失之处，并沿用文件中已有的注释风格，让新文档读起来与其余部分浑然一体。
---
