import { describe, it, expect } from 'vitest';
import { validateCatalog, filterPrompts } from '../../src/data/prompts.js';
import type { Prompt } from '../../src/types.js';

const samplePrompt: Prompt = {
  id: 'p1',
  sdlc: 'discover',
  cat: 'Understand',
  roles: [],
  prompt: 'explain what {path} does',
  slots: { path: 'src/x.ts' },
  src: 'workflows',
  title: '解释代码',
  teaches: '描述你想要的内容,让 Claude 找文件',
};

describe('validateCatalog', () => {
  it('合法 catalog 通过校验', () => {
    expect(() => validateCatalog({ prompts: [samplePrompt], sources: {} as any, labels: {} as any, taxonomy: {} as any })).not.toThrow();
  });

  it('id 重复时抛出错误', () => {
    expect(() => validateCatalog({ prompts: [samplePrompt, samplePrompt], sources: {} as any, labels: {} as any, taxonomy: {} as any })).toThrow(/duplicate/);
  });

  it('未知 sdlc 抛出错误', () => {
    expect(() => validateCatalog({ prompts: [{ ...samplePrompt, sdlc: 'wrong' as any }], sources: {} as any, labels: {} as any, taxonomy: {} as any })).toThrow();
  });
});

describe('filterPrompts', () => {
  const catalog = { prompts: [
    samplePrompt,
    { ...samplePrompt, id: 'p2', cat: 'Plan' as const, sdlc: 'design' as const, roles: ['pm' as const], title: '规划', prompt: 'plan the {feature}', slots: { feature: 'rate limits' } },
    { ...samplePrompt, id: 'p3', cat: 'Test' as const, sdlc: 'build' as const, startN: 1, title: '写测试' },
  ], sources: {} as any, labels: {} as any, taxonomy: {} as any };

  it('按搜索词过滤', () => {
    const r = filterPrompts(catalog, { q: '解释' });
    expect(r.map(p => p.id)).toEqual(['p1']);
  });

  it('按 sel(role) 过滤', () => {
    const r = filterPrompts(catalog, { sel: 'pm' });
    expect(r.map(p => p.id)).toEqual(['p2']);
  });

  it('按 sel(cat 标签,如 understand/plan) 过滤', () => {
    expect(filterPrompts(catalog, { sel: 'understand' }).map(p => p.id)).toEqual(['p1']);
    expect(filterPrompts(catalog, { sel: 'plan' }).map(p => p.id)).toEqual(['p2']);
  });

  it('start=true 仅返回 startN 有值且按 startN 排序', () => {
    const r = filterPrompts(catalog, { start: true });
    expect(r.map(p => p.id)).toEqual(['p3']);
  });

  it('start=false 返回全部', () => {
    const r = filterPrompts(catalog, { start: false });
    expect(r).toHaveLength(3);
  });
});