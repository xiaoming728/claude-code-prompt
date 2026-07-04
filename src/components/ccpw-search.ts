import { getStore, setStore, subscribe } from '../state/store.js';

class CCPWSearch extends HTMLElement {
  private unsub?: () => void;
  private input?: HTMLInputElement;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .wrap {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px; border: 1px solid var(--ccpw-border);
          border-radius: 12px; background: var(--ccpw-surface);
          transition: border-color 200ms;
        }
        .wrap:hover { border-color: var(--ccpw-accent); }
        .wrap:focus-within { border-color: var(--ccpw-accent); box-shadow: 0 0 0 3px var(--ccpw-accent-bg); }
        input { flex: 1; border: none; outline: none; background: transparent; color: var(--ccpw-text); font-size: 16px; }
        svg { flex-shrink: 0; color: var(--ccpw-text-4); }
      </style>
      <label class="wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="search" placeholder="搜索提示词…" aria-label="搜索提示词" />
      </label>
    `;
    this.input = shadow.querySelector('input')!;
    this.input.value = getStore().q;
    this.input.addEventListener('input', e => {
      const v = (e.target as HTMLInputElement).value;
      const { sel, start } = getStore();
      setStore({ q: v, start: v ? false : start, sel: v ? null : sel });
    });
    this.unsub = subscribe(() => {
      if (this.input && this.input.value !== getStore().q) {
        this.input.value = getStore().q;
      }
    });
  }

  disconnectedCallback() {
    this.unsub?.();
  }
}

customElements.define('ccpw-search', CCPWSearch);