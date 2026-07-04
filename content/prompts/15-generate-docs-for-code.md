---
id: generate-docs-for-code
sdlc: build
cat: Implement
roles: ['docs']
prompt: |
  find {scope} without {format} comments and add them, matching the style already used in the file
slots:
  scope: "the public functions in src/auth/"
  format: "JSDoc"
src: workflows
title: 为缺少文档的代码生成文档
teaches: |
  指明范围和格式。Claude 会找出缺失之处，并沿用文件中已有的注释风格，让新文档读起来与其余部分浑然一体。
---
