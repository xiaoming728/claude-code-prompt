---
id: write-tests-run-them
sdlc: build
cat: Test
startN: 4
roles: []
prompt: |
  write tests for {path}, run them, and fix any failures
slots:
  path: "app/parsers/feed.py"
nextHref: /en/memory
src: workflows
title: 编写测试、运行它们、修复失败
teaches: |
  把编写、运行和修复放在一起要求，这样 Claude 就能不断迭代，无需停下来等待指示。
next: |
  运行 `/init`，让 Claude 自动了解你的测试命令。
---
