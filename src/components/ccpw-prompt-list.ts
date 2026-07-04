import { getStore, subscribe } from '../state/store.js';
import { filterPrompts, groupByPhaseAndCat } from '../data/prompts.js';
import type { Prompt, PromptCatalog } from '../types.js';
import './ccpw-prompt-card.js';

class CCPWPromptList extends HTMLElement {
  private unsub?: () => void;
  private readyUnsub?: () => void;
  private lastSignature?: string;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>
      :host { display: block; }
      .group-h {
        font-size: 12.5px; letter-spacing: 0.08em; text-transform: uppercase;
        color: var(--ccpw-text-4); margin: 36px 0 14px;
        font-family: var(--ccpw-mono);
      }
      .group-h:first-child { margin-top: 4px; }
      .group-h .phase { color: var(--ccpw-text-3); }
      .grid { display: grid; gap: 14px; }
    </style><div class="root"></div>`;
    this.render();
    this.unsub = subscribe(() => this.render());
    document.addEventListener('ccpw:catalog-ready', this.render);
    this.readyUnsub = () => document.removeEventListener('ccpw:catalog-ready', this.render);
  }

  disconnectedCallback() {
    this.unsub?.();
    this.readyUnsub?.();
  }

  private render = () => {
    const root = this.shadowRoot?.querySelector('.root') as HTMLElement;
    if (!root) return;
    const catalog = (window as any).__ccpwCatalog as PromptCatalog | undefined;
    if (!catalog) { root.innerHTML = ''; return; }
    const s = getStore();
    const filtered = filterPrompts(catalog, { q: s.q, sel: s.sel, start: s.start });
    document.dispatchEvent(new CustomEvent('ccpw:filtered-count', { detail: filtered.length }));

    // 只有筛选结果实际变化时才重建卡片 DOM,避免填写 slot 输入框等无关 store
    // 变化(如主题切换、侧边栏抽屉开关)把正在编辑/展开的卡片整个销毁重建。
    const signature = `${s.start}|${filtered.map(p => p.id).join(',')}`;
    if (signature === this.lastSignature) return;
    this.lastSignature = signature;

    if (s.start) {
      const grid = Object.assign(document.createElement('div'), { className: 'grid' });
      grid.replaceChildren(...filtered.map((p, i) => this.renderCard(p, i)));
      root.replaceChildren(grid);
      return;
    }
    const groups = groupByPhaseAndCat(filtered);
    root.replaceChildren(...groups.flatMap(g => [
      Object.assign(document.createElement('div'), {
        className: 'group-h', innerHTML: `<span class="phase">${catalog.taxonomy.phaseLabels[g.sdlc]}</span> · ${catalog.taxonomy.catLabels[g.cat]}`,
      }),
      Object.assign(document.createElement('div'), {
        className: 'grid',
      }),
    ].map((el, idx) => {
      if (idx === 1) {
        (el as HTMLElement).replaceChildren(...g.items.map((p, i) => this.renderCard(p, i)));
      }
      return el;
    })));
  };

  private renderCard(p: Prompt, i: number): HTMLElement {
    const card = document.createElement('ccpw-prompt-card') as any;
    card.prompt = p;
    card.style.animationDelay = `${i * 30}ms`;
    return card;
  }
}

customElements.define('ccpw-prompt-list', CCPWPromptList);