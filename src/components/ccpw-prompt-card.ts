import { getStore, setStore, subscribe } from '../state/store.js';
import { saveOverride, removeOverride } from '../state/persistence.js';
import { assemblePrompt } from '../data/prompts.js';
import type { Prompt, PromptCatalog } from '../types.js';

class CCPWPromptCard extends HTMLElement {
  override prompt!: Prompt;
  private open = false;
  private unsub?: () => void;
  private copied = false;
  private copyTimer?: number;

  static get observedAttributes() { return ['prompt']; }

  set promptData(p: Prompt) { this.prompt = p; this.render(); }
  get promptData(): Prompt { return this.prompt; }

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    if (this.prompt) this.render();
  }

  attributeChangedCallback() { /* no-op, use property */ }

  disconnectedCallback() {
    this.unsub?.();
    if (this.copyTimer) clearTimeout(this.copyTimer);
  }

  private toggle() {
    this.open = !this.open;
    this.render();
  }

  private async copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    this.copied = true;
    this.render();
    if (this.copyTimer) clearTimeout(this.copyTimer);
    this.copyTimer = window.setTimeout(() => { this.copied = false; this.render(); }, 1600);
  }

  private onSlotChange(key: string, val: string) {
    const ov = getStore().overrides[this.prompt.id] ?? {};
    const slots = { ...(ov.slots ?? this.prompt.slots ?? {}), [key]: val };
    const next = { ...ov, slots };
    saveOverride(this.prompt.id, next);
    setStore({ overrides: { ...getStore().overrides, [this.prompt.id]: next } });
  }

  private restore() {
    removeOverride(this.prompt.id);
    const overrides = { ...getStore().overrides };
    delete overrides[this.prompt.id];
    setStore({ overrides });
  }

  private render() {
    if (!this.prompt) return;
    const s = getStore();
    const catalog = (window as any).__ccpwCatalog as PromptCatalog | undefined;
    const ov = s.overrides[this.prompt.id];
    const slots = { ...(this.prompt.slots ?? {}), ...(ov?.slots ?? {}) };
    const finalPrompt = assemblePrompt(this.prompt, ov);
    const srcLabel = catalog?.taxonomy.sourceLabels[this.prompt.src] ?? this.prompt.src;

    const shadow = this.shadowRoot!;
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .card {
          border: 1px solid var(--ccpw-border-subtle);
          border-radius: 10px; margin-bottom: 12px;
          background: var(--ccpw-bg); overflow: hidden;
          padding: 14px 18px; transition: border-color 200ms;
          font-family: var(--ccpw-font-sans);
        }
        .card.open { border-color: var(--ccpw-border); background: var(--ccpw-surface); }
        .head { display: flex; align-items: baseline; gap: 12px; }
        .title { flex: 1; font-size: 17px; font-weight: 500; color: var(--ccpw-text); cursor: pointer; }
        .chip { font-size: 11px; padding: 3px 9px; border-radius: 999px; background: var(--ccpw-accent-bg); color: var(--ccpw-accent); font-family: var(--ccpw-mono); }
        .preview { display: block; font-family: var(--ccpw-mono); font-size: 13.5px; color: var(--ccpw-text-3); margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .body { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--ccpw-border-subtle); }
        .label { font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ccpw-text-4); margin: 12px 0 8px; font-family: var(--ccpw-mono); }
        .prompt-box { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: #0a0e14; color: #f0eee6; border-radius: 8px; font-family: var(--ccpw-mono); font-size: 15px; flex-wrap: wrap; }
        .caret { color: var(--ccpw-accent); flex-shrink: 0; }
        .slot { background: rgba(132,204,22,0.15); color: #f0eee6; border: none; border-bottom: 1.5px dashed var(--ccpw-accent); border-radius: 4px 4px 0 0; padding: 2px 6px; margin: 0 1px; outline: none; min-width: 8ch; max-width: 100%; font-family: inherit; }
        .copy { font-size: 12.5px; padding: 6px 12px; border-radius: 6px; background: var(--ccpw-accent); color: #0a0e14; border: none; font-weight: 500; margin-left: auto; }
        .teaches { font-size: 15.5px; color: var(--ccpw-text-2); line-height: 1.6; margin-top: 4px; }
        .next { display: flex; align-items: baseline; gap: 10px; margin: 14px 0 0; padding: 10px 12px; background: var(--ccpw-accent-bg); border-radius: 8px; font-size: 14.5px; }
        .next-label { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ccpw-accent); font-weight: 600; flex-shrink: 0; font-family: var(--ccpw-mono); }
        .src { font-size: 13px; color: var(--ccpw-text-4); margin-top: 12px; }
        .restore { margin-left: 12px; background: none; border: 1px solid var(--ccpw-border); color: var(--ccpw-text-2); padding: 6px 12px; border-radius: 6px; font-size: 13px; }
      </style>
      <div class="card ${this.open ? 'open' : ''} ccpw-card">
        <button type="button" class="head" style="all:unset; display:flex; align-items:baseline; gap:12px; cursor:pointer; width:100%;">
          <span class="title">${escapeHtml(this.prompt.title)}</span>
          ${this.prompt.startN ? `<span class="chip">新手入门 · ${this.prompt.startN}</span>` : ''}
        </button>
        <code class="preview">${escapeHtml(this.previewPrompt())}</code>
        ${this.open ? `
          <div class="body">
            <div class="label">${this.prompt.slots ? '填写并复制' : '复制这条提示词'}</div>
            <div class="prompt-box">
              <span class="caret">❯</span>
              ${this.renderPromptBody(slots)}
              <button type="button" class="copy">${this.copied ? '已复制' : '复制'}</button>
            </div>
            <div class="label">为什么有效</div>
            <div class="teaches">${escapeHtml(this.prompt.teaches)}</div>
            ${this.prompt.next ? `
              <div class="next">
                <span class="next-label">巩固记忆</span>
                <span>${escapeHtml(this.prompt.next)}</span>
              </div>
            ` : ''}
            <div class="src">来源:${escapeHtml(srcLabel)}</div>
            ${ov ? `<button type="button" class="restore">恢复官方默认</button>` : ''}
          </div>
        ` : ''}
      </div>
    `;

    const headBtn = shadow.querySelector('.head') as HTMLButtonElement;
    headBtn?.addEventListener('click', () => this.toggle());
    const copyBtn = shadow.querySelector('.copy') as HTMLButtonElement | null;
    copyBtn?.addEventListener('click', () => this.copy(finalPrompt));
    shadow.querySelectorAll<HTMLInputElement>('.slot').forEach(input => {
      input.addEventListener('input', () => this.onSlotChange(input.dataset.key!, input.value));
    });
    const restoreBtn = shadow.querySelector('.restore') as HTMLButtonElement | null;
    restoreBtn?.addEventListener('click', () => this.restore());
  }

  private previewPrompt(): string {
    return assemblePrompt(this.prompt, getStore().overrides[this.prompt.id]);
  }

  private renderPromptBody(slots: Record<string, string>): string {
    const tmpl = this.prompt.prompt;
    return tmpl.split(/(\{\w+\})/g).map(part => {
      const m = part.match(/^\{(\w+)\}$/);
      if (!m) return `<span>${escapeHtml(part)}</span>`;
      const k = m[1]!;
      const val = slots[k] ?? '';
      return `<input type="text" class="slot" data-key="${k}" value="${escapeHtml(val)}" placeholder="${escapeHtml(this.prompt.slots?.[k] ?? k)}" />`;
    }).join('');
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

customElements.define('ccpw-prompt-card', CCPWPromptCard);

// expose helper for ccpw-prompt-list
declare global { interface HTMLElement { prompt?: Prompt; } }