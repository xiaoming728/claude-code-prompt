import type { Override, Role, Theme } from '../types.js';

export interface Store {
  theme: Theme;
  q: string;
  sel: Role | null;
  start: boolean;
  overrides: Record<string, Override>;
  prefersReducedMotion: boolean;
  activeSection: string;
  sidebarOpen: boolean;
}

const subs = new Set<() => void>();
let state: Store = {
  theme: 'system',
  q: '',
  sel: null,
  start: true,
  overrides: {},
  prefersReducedMotion: false,
  activeSection: 'prompts',
  sidebarOpen: false,
};

export function getStore(): Readonly<Store> {
  return state;
}

export function setStore(patch: Partial<Store>): void {
  state = { ...state, ...patch };
  subs.forEach(fn => fn());
}

export function subscribe(fn: () => void): () => void {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

export function _resetStore(): void {
  state = {
    theme: 'system',
    q: '',
    sel: null,
    start: true,
    overrides: {},
    prefersReducedMotion: false,
    activeSection: 'prompts',
    sidebarOpen: false,
  };
  subs.clear();
}
