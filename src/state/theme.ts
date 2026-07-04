import { getStore, setStore, subscribe } from './store.js';
import { loadTheme, saveTheme } from './persistence.js';

export function initTheme(): void {
  const theme = loadTheme();
  setStore({ theme });
  applyTheme();
  subscribe(() => {
    saveTheme(getStore().theme);
    applyTheme();
  });

  // 跟随系统
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (getStore().theme === 'system') applyTheme();
    };
    mql.addEventListener('change', onChange);
  }
}

export function applyTheme(): void {
  if (typeof document === 'undefined') return;
  const { theme } = getStore();
  let effective: 'light' | 'dark';
  if (theme === 'system') {
    const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    effective = dark ? 'dark' : 'light';
  } else {
    effective = theme;
  }
  document.documentElement.dataset.theme = effective;
}

export function toggleTheme(): void {
  const { theme } = getStore();
  const next = theme === 'dark' ? 'light' : 'dark';
  setStore({ theme: next });
}

export function setSystemTheme(): void {
  setStore({ theme: 'system' });
}