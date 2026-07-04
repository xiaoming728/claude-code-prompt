---
id: review-a-pull-request
sdlc: build
cat: Review
roles: []
prompt: |
  review PR #{pr} and summarize what changed, then list any concerns
slots:
  pr: "247"
needs: gh
nextHref: /en/code-review
src: workflows
title: 审查一个 pull request
teaches: |
  Claude 会在整个代码库的上下文中做审查，而不只盯着 diff。它会读取有改动的代码及其调用的内容，因此能发现只看 diff 的审查会漏掉的问题。
next: |
  用 Code Review 为每个 PR 都开启这项检查。
---
