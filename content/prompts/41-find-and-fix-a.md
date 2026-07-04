---
id: find-and-fix-a
sdlc: operate
cat: Debug
startN: 3
roles: []
prompt: |
  {test} 这个测试失败了，找出原因并修复它
slots:
  test: "UserAuth"
src: workflows
title: 找出并修复一个失败的测试
teaches: |
  描述症状即可，你不必知道是哪个文件出了问题。Claude 会运行测试来看到失败，追踪进源代码，并加以修复。
---
