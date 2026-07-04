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
  connectedCallback() {
    this.innerHTML = `
      <div class="ccpw-shell">
        <header class="ccpw-header">
          <h1>Claude 提示词工作台</h1>
          <ccpw-theme-toggle></ccpw-theme-toggle>
        </header>
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
    `;
    this.querySelector('#ccpw-reset-all')!.addEventListener('click', () => {
      clearAllOverrides();
      setStore({ overrides: {} });
    });
    bootstrapCatalog();
  }
}

customElements.define('ccpw-app', CCPWApp);