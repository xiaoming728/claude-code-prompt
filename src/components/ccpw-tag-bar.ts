import { getStore, setStore, subscribe } from '../state/store.js';
import type { PromptCatalog, Role } from '../types.js';

const TAG_ORDER: Role[] = ['understand', 'plan', 'prototype', 'build', 'test', 'refactor', 'review', 'steer', 'debug', 'git', 'release', 'data', 'automate', 'pm', 'design', 'docs', 'marketing', 'security', 'ops'];

class CCPWTagBar extends HTMLElement {
  private unsub?: () => void;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .bar { display: flex; flex-wrap: wrap; row-gap: 12px; column-gap: 8px; align-items: center; }
        button {
          padding: 6px 12px; border: 1px solid var(--ccpw-border);
          border-radius: 999px; background: var(--ccpw-bg);
          color: var(--ccpw-text-2); font-size: 14px;
          transition: all 200ms;
        }
        button:hover { background: var(--ccpw-accent-bg); border-color: var(--ccpw-accent); }
        button.on { background: var(--ccpw-accent); border-color: var(--ccpw-accent); color: #0a0e14; font-weight: 500; }
        button.on:hover { filter: brightness(1.08); }
        button.start { color: var(--ccpw-accent); }
        button.start.on { color: #0a0e14; }
        .sep { width: 1px; height: 22px; background: var(--ccpw-border); margin: 0 4px; }
        .clear { color: var(--ccpw-text-4); font-size: 13px; }
      </style>
      <div class="bar" part="bar"></div>
    `;
    this.render();
    this.unsub = subscribe(() => this.render());
  }

  disconnectedCallback() { this.unsub?.(); }

  private render() {
    const bar = this.shadowRoot!.querySelector('.bar')!;
    const s = getStore();
    const catalog = (window as any).__ccpwCatalog as PromptCatalog | undefined;
    const labelOf = (k: Role) => catalog?.taxonomy.tagLabels[k] ?? k;

    const startBtn = document.createElement('button');
    startBtn.className = `start${s.start ? ' on' : ''}`;
    startBtn.textContent = `★ 新手入门`;
    startBtn.addEventListener('click', () => setStore({ start: !s.start, sel: null, q: '' }));
    bar.replaceChildren(startBtn);

    const sep = document.createElement('span'); sep.className = 'sep'; bar.appendChild(sep);

    for (const k of TAG_ORDER) {
      const btn = document.createElement('button');
      btn.className = s.sel === k ? 'on' : '';
      btn.textContent = labelOf(k);
      btn.addEventListener('click', () => setStore({ sel: s.sel === k ? null : k, start: false }));
      bar.appendChild(btn);
    }

    if (s.start || s.sel || s.q) {
      const clear = document.createElement('button');
      clear.className = 'clear';
      clear.textContent = '清除';
      clear.addEventListener('click', () => setStore({ start: true, sel: null, q: '' }));
      bar.appendChild(clear);
    }
  }
}

customElements.define('ccpw-tag-bar', CCPWTagBar);