import { setStore, subscribe } from './store.js';

export function initMotion(): void {
  if (typeof window === 'undefined' || !window.matchMedia) return;
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  setStore({ prefersReducedMotion: mql.matches });
  mql.addEventListener('change', e => {
    setStore({ prefersReducedMotion: e.matches });
  });
}

export function shouldAnimate(): boolean {
  return false; // 占位,实际由 subscribe 同步;此处仅作 helper
}