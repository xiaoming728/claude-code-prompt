import { describe, it, expect, beforeEach } from 'vitest';
import { getStore, setStore, subscribe, _resetStore } from '../../src/state/store.js';

beforeEach(() => _resetStore());

describe('store', () => {
  it('初始状态含默认值', () => {
    const s = getStore();
    expect(s.theme).toBe('system');
    expect(s.q).toBe('');
    expect(s.sel).toBeNull();
    expect(s.start).toBe(true);
    expect(s.overrides).toEqual({});
  });

  it('setter 触发订阅', () => {
    let called = 0;
    subscribe(() => called++);
    setStore({ q: 'test' });
    expect(called).toBe(1);
    expect(getStore().q).toBe('test');
  });

  it('批量 setStore 只触发一次订阅', () => {
    let called = 0;
    subscribe(() => called++);
    setStore({ q: 'a' });
    setStore({ sel: 'debug' as any });
    expect(called).toBe(2);
  });

  it('unsubscribe 取消订阅', () => {
    let called = 0;
    const unsub = subscribe(() => called++);
    setStore({ q: 'a' });
    expect(called).toBe(1);
    unsub();
    setStore({ q: 'b' });
    expect(called).toBe(1);
  });

  it('setter 不影响未变更字段', () => {
    setStore({ q: 'foo' });
    setStore({ sel: 'debug' as any });
    expect(getStore().q).toBe('foo');
    expect(getStore().sel).toBe('debug');
  });
});