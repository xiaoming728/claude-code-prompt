import { describe, it, expect } from 'vitest';
import { parseFrontmatter, validatePrompt, buildCatalog } from '../../scripts/build-content.js';

const SAMPLE_MD = `---
id: test-prompt
sdlc: discover
cat: Onboard
roles: []
prompt: give me an overview
src: workflows
title: 测试
teaches: 测试说明
---

正文内容(可忽略)。
`;

describe('parseFrontmatter', () => {
  it('从 md 字符串解析出 frontmatter 与正文', () => {
    const result = parseFrontmatter(SAMPLE_MD);
    expect(result.data.id).toBe('test-prompt');
    expect(result.data.sdlc).toBe('discover');
    expect(result.data.title).toBe('测试');
    expect(result.content).toContain('正文内容');
  });
});

describe('validatePrompt', () => {
  it('必填字段缺失时抛出明确错误', () => {
    expect(() => validatePrompt({ id: 'x' })).toThrow(/sdlc/);
  });

  it('枚举值非法时抛出错误', () => {
    expect(() => validatePrompt({ id: 'x', sdlc: 'wrong', cat: 'Onboard', prompt: 'p', src: 'workflows', title: 't', teaches: 't' })).toThrow(/sdlc/);
  });

  it('id 重复时抛出错误', () => {
    const seen = new Set(['dup']);
    expect(() => validatePrompt({ id: 'dup', sdlc: 'discover', cat: 'Onboard', prompt: 'p', src: 'workflows', title: 't', teaches: 't' }, seen)).toThrow(/duplicate/);
  });

  it('prompt 中 {slot} 不在 slots 中时抛出错误', () => {
    expect(() => validatePrompt({ id: 'x', sdlc: 'discover', cat: 'Onboard', prompt: 'see {path}', slots: { file: 'a' }, src: 'workflows', title: 't', teaches: 't' })).toThrow(/path/);
  });

  it('startN 超出 1..5 时抛出错误', () => {
    expect(() => validatePrompt({ id: 'x', sdlc: 'discover', cat: 'Onboard', prompt: 'p', src: 'workflows', title: 't', teaches: 't', startN: 9 })).toThrow(/startN/);
  });

  it('合法 prompt 通过校验', () => {
    expect(() => validatePrompt({ id: 'x', sdlc: 'discover', cat: 'Onboard', prompt: 'p', src: 'workflows', title: 't', teaches: 't' })).not.toThrow();
  });
});

describe('buildCatalog', () => {
  it('聚合多份 md 为 catalog 并强制 id 唯一', async () => {
    const catalog = await buildCatalog([SAMPLE_MD, SAMPLE_MD]);
    expect(catalog.prompts).toHaveLength(2);
  });
});