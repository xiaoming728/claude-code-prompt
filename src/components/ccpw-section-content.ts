import type { SectionCommand, SectionContent } from '../types.js';

class CCPWSectionContent extends HTMLElement {
  private content?: SectionContent;
  private copiedName: string | null = null;
  private copyTimer?: number;

  set data(c: SectionContent) {
    this.content = c;
    this.copiedName = null;
    this.render();
  }

  get data(): SectionContent | undefined {
    return this.content;
  }

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    if (this.content) this.render();
  }

  disconnectedCallback() {
    if (this.copyTimer) clearTimeout(this.copyTimer);
  }

  private async copy(text: string, name: string) {
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
    this.copiedName = name;
    this.render();
    if (this.copyTimer) clearTimeout(this.copyTimer);
    this.copyTimer = window.setTimeout(() => { this.copiedName = null; this.render(); }, 1600);
  }

  private render() {
    if (!this.content) return;
    const c = this.content;
    const shadow = this.shadowRoot!;
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        :host([hidden]) { display: none; }
        .head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 8px; flex-wrap: wrap; }
        h2 { font-size: 22px; font-weight: 600; color: var(--ccpw-text); }
        .repo-link {
          font-size: 13px; color: var(--ccpw-text-4); font-family: var(--ccpw-mono);
          transition: color 150ms;
        }
        .repo-link:hover { color: var(--ccpw-accent); }
        .intro {
          font-size: 15.5px; color: var(--ccpw-text-2); line-height: 1.7;
          margin-bottom: 28px;
        }
        .principle {
          display: flex; align-items: baseline; gap: 10px;
          margin: -8px 0 28px; padding: 14px 16px;
          background: var(--ccpw-accent-bg); border-radius: 8px;
          font-size: 14.5px; flex-wrap: wrap;
        }
        .principle-label {
          font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--ccpw-accent); font-weight: 600; flex-shrink: 0;
          font-family: var(--ccpw-mono);
        }
        .group-label {
          font-size: 12.5px; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--ccpw-text-4); margin: 28px 0 14px;
          font-family: var(--ccpw-mono);
        }
        .group-label:first-of-type { margin-top: 0; }
        .cmd-list { display: grid; gap: 14px; }
        .cmd {
          border: 1px solid var(--ccpw-border-subtle);
          border-radius: 12px; padding: 18px 22px;
          background: var(--ccpw-bg);
          min-width: 0; overflow-wrap: break-word; word-break: break-word;
        }
        .cmd-name {
          font-family: var(--ccpw-mono); font-size: 15px; font-weight: 600;
          color: var(--ccpw-accent);
        }
        .cmd-desc {
          font-size: 14.5px; color: var(--ccpw-text-2); line-height: 1.6;
          margin-top: 6px;
        }
        .example-box {
          display: flex; align-items: center; gap: 10px;
          margin-top: 12px; padding: 12px 16px;
          background: #0a0e14; color: #f0eee6; border-radius: 8px;
          font-family: var(--ccpw-mono); font-size: 14px;
          flex-wrap: wrap; min-width: 0;
        }
        .example-text { flex: 1; min-width: 0; overflow-wrap: break-word; word-break: break-word; }
        .example-text > span { min-width: 0; }
        .slot {
          background: rgba(132,204,22,0.15); color: #f0eee6; border: none;
          border-bottom: 1.5px dashed var(--ccpw-accent); border-radius: 4px 4px 0 0;
          padding: 2px 6px; margin: 0 1px; outline: none;
          min-width: 6ch; max-width: 100%; font-family: inherit; font-size: inherit;
          transition: background-color 150ms;
        }
        .slot:hover { background: rgba(132,204,22,0.24); }
        .copy {
          font-size: 12.5px; padding: 6px 12px; border-radius: 6px;
          background: var(--ccpw-accent); color: #0a0e14; border: none;
          font-weight: 500; transition: filter 150ms; flex-shrink: 0;
        }
        .copy:hover { filter: brightness(1.08); }
        .reset {
          font-size: 12.5px; padding: 6px 12px; border-radius: 6px;
          background: none; border: 1px solid rgba(240,238,230,0.25); color: #f0eee6;
          font-weight: 500; margin-left: auto; flex-shrink: 0;
          transition: background-color 150ms, border-color 150ms;
        }
        .reset:hover { background: var(--ccpw-accent-bg); border-color: var(--ccpw-accent); }
      </style>
      <div class="head">
        <h2>${escapeHtml(c.label)}</h2>
        <a class="repo-link" href="${escapeHtml(c.repoUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(c.repoUrl.replace('https://github.com/', 'github.com/'))}</a>
      </div>
      <p class="intro">${escapeHtml(c.intro)}</p>
      ${c.principle ? `<div class="principle"><span class="principle-label">核心理念</span><span>${escapeHtml(c.principle)}</span></div>` : ''}
      ${c.install.length ? `<div class="group-label">安装命令</div><div class="cmd-list">${c.install.map(cmd => this.renderCmd(cmd)).join('')}</div>` : ''}
      ${c.skills.length ? `<div class="group-label">Skill 命令</div><div class="cmd-list">${c.skills.map(cmd => this.renderCmd(cmd)).join('')}</div>` : ''}
      ${c.usage.length ? `<div class="group-label">使用命令</div><div class="cmd-list">${c.usage.map(cmd => this.renderCmd(cmd)).join('')}</div>` : ''}
    `;
    shadow.querySelectorAll<HTMLButtonElement>('.copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const box = btn.closest('.example-box') as HTMLElement;
        const name = btn.dataset.name!;
        const template = btn.dataset.template!;
        const values: Record<string, string> = {};
        box.querySelectorAll<HTMLInputElement>('.slot').forEach(input => {
          values[input.dataset.key!] = input.value;
        });
        const text = template.replace(/\{([\w-]+)\}/g, (_, k) => values[k] ?? `{${k}}`);
        this.copy(text, name);
      });
    });
    shadow.querySelectorAll<HTMLButtonElement>('.reset').forEach(btn => {
      btn.addEventListener('click', () => {
        const box = btn.closest('.example-box') as HTMLElement;
        box.querySelectorAll<HTMLInputElement>('.slot').forEach(input => {
          input.value = input.dataset.default ?? '';
          input.size = Math.max(input.value.length, 6);
        });
      });
    });
    shadow.querySelectorAll<HTMLInputElement>('.slot').forEach(input => {
      // 输入框宽度跟着内容动态调整,避免长文本被固定宽度截断/隐藏
      input.addEventListener('input', () => {
        input.size = Math.max(input.value.length, 6);
      });
    });
  }

  private renderCmd(cmd: SectionCommand): string {
    const hasSlots = !!cmd.example && /\{[\w-]+\}/.test(cmd.example);
    return `
      <div class="cmd">
        <div class="cmd-name">${escapeHtml(cmd.name)}</div>
        <div class="cmd-desc">${escapeHtml(cmd.description)}</div>
        ${cmd.example ? `
          <div class="example-box">
            <span class="caret" style="color:var(--ccpw-accent);flex-shrink:0;">❯</span>
            <code class="example-text">${this.renderExampleBody(cmd)}</code>
            ${hasSlots ? `<button type="button" class="reset">重置</button>` : ''}
            <button type="button" class="copy" data-name="${escapeHtml(cmd.name)}" data-template="${escapeHtml(cmd.example)}">${this.copiedName === cmd.name ? '已复制' : '复制'}</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  private renderExampleBody(cmd: SectionCommand): string {
    const tmpl = cmd.example!;
    return tmpl.split(/(\{[\w-]+\})/g).map(part => {
      const m = part.match(/^\{([\w-]+)\}$/);
      if (!m) return `<span>${escapeHtml(part)}</span>`;
      const key = m[1]!;
      const val = cmd.slots?.[key] ?? '';
      const size = Math.max(val.length, key.length, 6);
      return `<input type="text" class="slot" data-key="${escapeHtml(key)}" data-default="${escapeHtml(val)}" value="${escapeHtml(val)}" placeholder="${escapeHtml(key)}" size="${size}" />`;
    }).join('');
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]!));
}

customElements.define('ccpw-section-content', CCPWSectionContent);
