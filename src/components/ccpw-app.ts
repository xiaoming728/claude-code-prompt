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
import './ccpw-section-content.js';
import { findNavItem } from './ccpw-sidebar-nav.js';
import type { SectionContent } from '../types.js';
import { openspecContent } from '../data/sections/openspec.js';
import { superpowersContent } from '../data/sections/superpowers.js';
import { eccContent } from '../data/sections/ecc.js';
import { gstackContent } from '../data/sections/gstack.js';
import { cometContent } from '../data/sections/comet.js';

const SECTION_DATA: Record<string, SectionContent> = {
  comet: cometContent,
  openspec: openspecContent,
  superpowers: superpowersContent,
  ecc: eccContent,
  gstack: gstackContent,
};

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
          <ccpw-section-content class="ccpw-section-content" hidden></ccpw-section-content>
          <div class="ccpw-placeholder" hidden></div>
        </div>
        <footer class="ccpw-global-footer">
          <a href="https://www.xiaoming728.com" target="_blank" rel="noopener noreferrer">xiaoming728</a>
        </footer>
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
    const sectionEl = this.querySelector('.ccpw-section-content') as HTMLElement & { data: SectionContent };
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
      const sectionData = SECTION_DATA[s.activeSection];
      content.hidden = !isPrompts;
      sectionEl.hidden = !sectionData;
      placeholder.hidden = isPrompts || !!sectionData;
      if (sectionData) {
        sectionEl.data = sectionData;
      } else if (!isPrompts) {
        const label = findNavItem(s.activeSection)?.label ?? s.activeSection;
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
