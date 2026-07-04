import { getStore, setStore, subscribe } from '../state/store.js';

export interface NavItem { id: string; label: string; }
export interface NavGroup { label: string; items: NavItem[]; }

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Claude Code',
    items: [
      { id: 'prompts', label: '提示词' },
    ],
  },
  {
    label: 'AI 编码最佳实践',
    items: [
      { id: 'comet', label: 'Comet' },
      { id: 'openspec', label: 'OpenSpec' },
      { id: 'superpowers', label: 'Superpowers' },
      { id: 'ecc', label: 'ECC' },
      { id: 'gstack', label: 'gstack' },
    ],
  },
];

export function findNavItem(id: string): NavItem | undefined {
  return NAV_GROUPS.flatMap(g => g.items).find(item => item.id === id);
}

class CCPWSidebarNav extends HTMLElement {
  private unsub?: () => void;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        nav { display: flex; flex-direction: column; gap: 20px; }
        .group-label {
          padding: 0 12px;
          margin-bottom: 4px;
          font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--ccpw-text-4); font-family: var(--ccpw-mono);
        }
        .group-items { display: flex; flex-direction: column; gap: 4px; }
        button {
          display: block; width: 100%; text-align: left;
          padding: 8px 12px; border-radius: 8px;
          color: var(--ccpw-text-2); font-size: 14.5px;
          transition: background-color 150ms, color 150ms;
          background: none; border: none; cursor: pointer; font-family: inherit;
        }
        button:hover { background: var(--ccpw-accent-bg); }
        button.active {
          background: var(--ccpw-accent-bg);
          color: var(--ccpw-accent);
          font-weight: 500;
        }
        @media (max-width: 640px) {
          :host {
            position: fixed; left: 0; top: 0; height: 100%; width: 224px;
            padding: 20px 16px; background: var(--ccpw-bg);
            border-right: 1px solid var(--ccpw-border);
            transform: translateX(-100%);
            transition: transform 200ms ease, visibility 200ms ease;
            visibility: hidden;
            z-index: 50;
            overflow-y: auto;
          }
          :host(.open) { transform: translateX(0); visibility: visible; }
        }
        @media (prefers-reduced-motion: reduce) {
          :host { transition: none; }
        }
      </style>
      <nav part="nav"></nav>
    `;
    this.render();
    this.unsub = subscribe(() => this.render());
  }

  disconnectedCallback() {
    this.unsub?.();
  }

  private render() {
    const nav = this.shadowRoot!.querySelector('nav')!;
    const s = getStore();
    this.classList.toggle('open', s.sidebarOpen);
    nav.replaceChildren(...NAV_GROUPS.map(group => {
      const section = document.createElement('div');
      const label = document.createElement('div');
      label.className = 'group-label';
      label.textContent = group.label;
      const items = document.createElement('div');
      items.className = 'group-items';
      items.replaceChildren(...group.items.map(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = item.label;
        btn.className = s.activeSection === item.id ? 'active' : '';
        btn.addEventListener('click', () => {
          setStore({ activeSection: item.id, sidebarOpen: false });
        });
        return btn;
      }));
      section.replaceChildren(label, items);
      return section;
    }));
  }
}

customElements.define('ccpw-sidebar-nav', CCPWSidebarNav);
