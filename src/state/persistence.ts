import type { Override, Theme } from '../types.js';

// 兜底:若宿主没有 localStorage(如 Node 测试、隐私模式),用内存 Storage 提供最小兼容
if (typeof (globalThis as { localStorage?: unknown }).localStorage === 'undefined') {
  class MemoryStorage {
    private store = new Map<string, string>();
    get length(): number { return this.store.size; }
    key(i: number): string | null { return Array.from(this.store.keys())[i] ?? null; }
    getItem(k: string): string | null { return this.store.get(k) ?? null; }
    setItem(k: string, v: string): void { this.store.set(k, String(v)); }
    removeItem(k: string): void { this.store.delete(k); }
    clear(): void { this.store.clear(); }
  }
  (globalThis as unknown as { Storage: typeof MemoryStorage }).Storage = MemoryStorage;
  (globalThis as unknown as { localStorage: MemoryStorage }).localStorage = new MemoryStorage();
}

const KEY_PREFIX = 'ccpw:zh:v1';
const OVERRIDE_KEY = (id: string) => `${KEY_PREFIX}:overrides:${id}`;
const THEME_KEY = `${KEY_PREFIX}:prefs:theme`;

// 内存兜底(隐私模式下 localStorage 抛错)
const memoryOverrides = new Map<string, Override>();

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 内存兜底
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // 忽略
  }
}

export function loadOverrides(): Record<string, Override> {
  const result: Record<string, Override> = {};
  // 从 localStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`${KEY_PREFIX}:overrides:`)) {
        const raw = safeGet(k);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw) as Override;
          const id = k.slice(`${KEY_PREFIX}:overrides:`.length);
          result[id] = parsed;
        } catch {
          // 损坏 JSON 静默丢弃
        }
      }
    }
  } catch {
    // localStorage 完全不可用,使用内存
  }
  // 合并内存(覆盖 localStorage 中损坏条目)
  for (const [id, ov] of memoryOverrides) {
    result[id] = ov;
  }
  return result;
}

export function saveOverride(id: string, ov: Override): void {
  memoryOverrides.set(id, ov);
  safeSet(OVERRIDE_KEY(id), JSON.stringify(ov));
}

export function removeOverride(id: string): void {
  memoryOverrides.delete(id);
  safeRemove(OVERRIDE_KEY(id));
}

export function clearAllOverrides(): void {
  memoryOverrides.clear();
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`${KEY_PREFIX}:overrides:`)) keys.push(k);
    }
    keys.forEach(k => safeRemove(k));
  } catch {
    // 忽略
  }
}

export function loadTheme(): Theme {
  const raw = safeGet(THEME_KEY);
  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  return 'system';
}

export function saveTheme(theme: Theme): void {
  safeSet(THEME_KEY, theme);
}

// 测试钩子:清空内存兜底 Map,保证测试隔离(对外仅 persistence.test.ts 使用)
export function _resetMemoryForTests(): void {
  memoryOverrides.clear();
}