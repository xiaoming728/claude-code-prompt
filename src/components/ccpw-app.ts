import { loadCatalog } from '../data/prompts.js';
import { initTheme } from '../state/theme.js';
import { initMotion } from '../state/motion.js';
import { loadOverrides, saveOverride, removeOverride, clearAllOverrides } from '../state/persistence.js';
import { setStore, getStore, subscribe } from '../state/store.js';
import './ccpw-search.js';
import './ccpw-tag-bar.js';
import './ccpw-prompt-list.js';
import './ccpw-theme-toggle.js';
import './ccpw-empty-state.js';
import { NAV_ITEMS } from './ccpw-sidebar-nav.js';

let catalogReady: Promise<void> | null = null;

export async function bootstrapCatalog() {
  if (catalogReady) return catalogReady;
  catalogReady = (async () => {
    initMotion();
    const catalog = await loadCatalog();
    // 写入全局(组件可访问)
    (window as any).__ccpwCatalog = catalog;
    // 初始化 store
    setStore({ overrides: loadOverrides() });
    initTheme();
    document.dispatchEvent(new CustomEvent('ccpw:catalog-ready', { detail: catalog }));
  })();
  return catalogReady;
}

class CCPWApp extends HTMLElement {
  private unsub?: () => void;

  connectedCallback() {
    this.innerHTML = `
      <div class="ccpw-shell">
        <header class="ccpw-header">
          <button class="ccpw-sidebar-toggle" type="button" aria-label="打开导航" aria-expanded="false">☰</button>
          <div class="ccpw-title-group">
            <h1>Claude Code 提示台</h1>
            <p class="ccpw-subtitle">本项目由 Claude Fable 5 + Comet 开发</p>
          </div>
          <ccpw-theme-toggle></ccpw-theme-toggle>
        </header>
        <div class="ccpw-body">
          <ccpw-sidebar-nav></ccpw-sidebar-nav>
          <div class="ccpw-content">
            <p class="ccpw-source-note">提示词内容翻译整理自 Claude Code 官方文档 <a href="https://code.claude.com/docs/en/prompt-library" target="_blank" rel="noopener noreferrer">Prompt Library</a>，并针对中文语境做了本地化优化。</p>
            <ccpw-search></ccpw-search>
            <ccpw-tag-bar></ccpw-tag-bar>
            <main>
              <ccpw-prompt-list></ccpw-prompt-list>
              <ccpw-empty-state></ccpw-empty-state>
            </main>
            <footer class="ccpw-footer">
              <button id="ccpw-reset-all" type="button">恢复全部官方默认</button>
            </footer>
          </div>
          <div class="ccpw-placeholder" hidden></div>
        </div>
        <div class="ccpw-backdrop"></div>
      </div>
    `;
    this.querySelector('#ccpw-reset-all')!.addEventListener('click', () => {
      clearAllOverrides();
      setStore({ overrides: {} });
      document.dispatchEvent(new CustomEvent('ccpw:overrides-reset'));
    });

    const toggleBtn = this.querySelector('.ccpw-sidebar-toggle') as HTMLButtonElement;
    const backdrop = this.querySelector('.ccpw-backdrop') as HTMLElement;
    const content = this.querySelector('.ccpw-content') as HTMLElement;
    const placeholder = this.querySelector('.ccpw-placeholder') as HTMLElement;

    toggleBtn.addEventListener('click', () => {
      setStore({ sidebarOpen: !getStore().sidebarOpen });
    });
    backdrop.addEventListener('click', () => {
      setStore({ sidebarOpen: false });
    });

    const syncChrome = () => {
      const s = getStore();
      backdrop.classList.toggle('open', s.sidebarOpen);
      toggleBtn.setAttribute('aria-expanded', String(s.sidebarOpen));
      const isPrompts = s.activeSection === 'prompts';
      content.hidden = !isPrompts;
      placeholder.hidden = isPrompts;
      if (!isPrompts) {
        const label = NAV_ITEMS.find(item => item.id === s.activeSection)?.label ?? s.activeSection;
        placeholder.textContent = `「${label}」板块建设中，敬请期待。`;
      }
    };
    syncChrome();
    this.unsub = subscribe(syncChrome);

    bootstrapCatalog();
  }

  disconnectedCallback() {
    this.unsub?.();
  }
}

customElements.define('ccpw-app', CCPWApp);
