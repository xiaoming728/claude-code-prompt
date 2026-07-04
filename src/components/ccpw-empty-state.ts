import { getStore, subscribe } from '../state/store.js';
import type { PromptCatalog } from '../types.js';

class CCPWEmptyState extends HTMLElement {
  private unsub?: () => void;
  private count = 0;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>
      :host { display: block; }
      .empty {
        padding: 32px; text-align: center; color: var(--ccpw-text-4);
        border: 1px dashed var(--ccpw-border); border-radius: 10px;
        font-family: var(--ccpw-mono);
      }
      :host([hidden]) { display: none; }
    </style><div class="empty"></div>`;
    document.addEventListener('ccpw:filtered-count', ((e: CustomEvent) => { this.count = e.detail; this.render(); }) as EventListener);
    this.unsub = subscribe(() => this.render());
    this.render();
  }

  disconnectedCallback() { this.unsub?.(); }

  private render() {
    const root = this.shadowRoot?.querySelector('.empty') as HTMLElement;
    if (!root) return;
    const s = getStore();
    const catalog = (window as any).__ccpwCatalog as PromptCatalog | undefined;
    if (this.count === 0 && (s.q || s.sel) && catalog) {
      this.removeAttribute('hidden');
      root.textContent = s.q ? `没有匹配 “${s.q}” 的提示词` : '当前筛选下没有结果';
    } else {
      this.setAttribute('hidden', '');
    }
  }
}

customElements.define('ccpw-empty-state', CCPWEmptyState);