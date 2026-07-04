---
id: fill-gaps-from-a
sdlc: build
cat: Test
roles: []
prompt: |
  read {report} and add tests for the lowest-covered files until each is above {target}%
slots:
  report: "coverage/coverage-summary.json"
  target: "80"
nextHref: /en/goal
src: workflows
title: 依据覆盖率报告补齐缺口
teaches: |
  指向覆盖率报告，而不是去猜哪些地方没被测到。Claude 会读取真实的数字，并为最需要测试的文件编写测试。
next: |
  把它设为一个 `/goal`，让 Claude 持续编写测试，直到覆盖率达到目标。
---
