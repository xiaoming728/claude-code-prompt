import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadOverrides, saveOverride, removeOverride, loadTheme, saveTheme, clearAllOverrides, _resetMemoryForTests } from '../../src/state/persistence.js';

const KEY_PREFIX = 'ccpw:zh:v1';

beforeEach(() => {
  localStorage.clear();
  _resetMemoryForTests();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('persistence - overrides', () => {
  it('loadOverrides 初次为空对象', () => {
    expect(loadOverrides()).toEqual({});
  });

  it('saveOverride 与 loadOverrides 往返', () => {
    saveOverride('p1', { slots: { a: '1' } });
    expect(loadOverrides()).toEqual({ p1: { slots: { a: '1' } } });
  });

  it('removeOverride 移除单条', () => {
    saveOverride('p1', { prompt: 'x' });
    saveOverride('p2', { prompt: 'y' });
    removeOverride('p1');
    expect(loadOverrides()).toEqual({ p2: { prompt: 'y' } });
  });

  it('clearAllOverrides 清空所有 ccpw:zh:v1:overrides:*', () => {
    saveOverride('p1', {});
    saveOverride('p2', {});
    clearAllOverrides();
    expect(loadOverrides()).toEqual({});
  });

  it('localStorage 抛错时回退内存', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    saveOverride('p1', { prompt: 'x' });
    expect(loadOverrides()).toEqual({ p1: { prompt: 'x' } });
  });

  it('损坏 JSON 静默丢弃', () => {
    localStorage.setItem(`${KEY_PREFIX}:overrides:p1`, '{not json');
    expect(loadOverrides()).toEqual({});
  });
});

describe('persistence - theme', () => {
  it('loadTheme 默认 system', () => {
    expect(loadTheme()).toBe('system');
  });

  it('saveTheme 与 loadTheme 往返', () => {
    saveTheme('dark');
    expect(loadTheme()).toBe('dark');
  });
});