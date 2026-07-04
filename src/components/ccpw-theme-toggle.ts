import { getStore, setStore, subscribe } from '../state/store.js';
import type { Theme } from '../types.js';

const ICONS: Record<Theme, string> = {
  system: '◐', light: '☀', dark: '☾',
};

class CCPWThemeToggle extends HTMLElement {
  private unsub?: () => void;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display: inline-block; }
        button {
          padding: 6px 12px; border: 1px solid var(--ccpw-border);
          border-radius: 6px; background: var(--ccpw-bg);
          color: var(--ccpw-text); font-family: var(--ccpw-mono);
          font-size: 14px; transition: all 200ms;
        }
        button:hover { background: var(--ccpw-accent-bg); border-color: var(--ccpw-accent); }
      </style>
      <button type="button" aria-label="切换主题"></button>
    `;
    this.render();
    shadow.querySelector('button')!.addEventListener('click', () => this.cycle());
    this.unsub = subscribe(() => this.render());
  }

  disconnectedCallback() { this.unsub?.(); }

  private cycle() {
    const order: Theme[] = ['system', 'light', 'dark'];
    const cur = getStore().theme;
    const idx = order.indexOf(cur);
    setStore({ theme: order[(idx + 1) % order.length]! });
  }

  private render() {
    const btn = this.shadowRoot?.querySelector('button');
    if (!btn) return;
    const t = getStore().theme;
    btn.textContent = `${ICONS[t]} ${t === 'system' ? '跟随系统' : t === 'light' ? '亮色' : '暗色'}`;
  }
}

customElements.define('ccpw-theme-toggle', CCPWThemeToggle);