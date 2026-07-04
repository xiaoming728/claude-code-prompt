import type { Prompt, PromptCatalog, Role, Sdlc, Cat } from '../types.js';

const SDLCS: Sdlc[] = ['discover', 'design', 'build', 'ship', 'operate'];
const CATS: Cat[] = ['Onboard', 'Understand', 'Plan', 'Prototype', 'Implement', 'Test', 'Refactor', 'Review', 'Steer', 'Git', 'Release', 'Debug', 'Incident', 'Data', 'Automate'];
const ROLES: Role[] = ['understand', 'plan', 'prototype', 'build', 'test', 'refactor', 'review', 'steer', 'debug', 'git', 'release', 'data', 'automate', 'pm', 'design', 'docs', 'marketing', 'security', 'ops'];

export function validateCatalog(catalog: PromptCatalog): void {
  const seen = new Set<string>();
  for (const p of catalog.prompts) {
    if (seen.has(p.id)) throw new Error(`duplicate id: ${p.id}`);
    seen.add(p.id);
    if (!SDLCS.includes(p.sdlc)) throw new Error(`invalid sdlc: ${p.sdlc}`);
    if (!CATS.includes(p.cat)) throw new Error(`invalid cat: ${p.cat}`);
    for (const r of p.roles) {
      if (!ROLES.includes(r)) throw new Error(`invalid role: ${r}`);
    }
  }
}

export async function loadCatalog(): Promise<PromptCatalog> {
  // 内置兜底 i18n 字典(若 fetch 失败使用)
  const fallback = await import('./i18n.js');
  try {
    const res = await fetch('./prompts.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as Omit<PromptCatalog, 'labels' | 'taxonomy'>;
    return { ...data, labels: fallback.LABELS, taxonomy: fallback.TAXONOMY };
  } catch {
    return { prompts: [], sources: {} as any, labels: fallback.LABELS, taxonomy: fallback.TAXONOMY };
  }
}

export function assemblePrompt(p: Prompt, overrides?: { slots?: Record<string, string>; prompt?: string }): string {
  const tmpl = overrides?.prompt ?? p.prompt;
  const slots = { ...(p.slots ?? {}), ...(overrides?.slots ?? {}) };
  return tmpl.replace(/\{(\w+)\}/g, (_, k) => slots[k] ?? `{${k}}`);
}

export interface FilterOpts {
  q?: string;
  sel?: Role | null;
  start?: boolean;
}

export function filterPrompts(catalog: PromptCatalog, opts: FilterOpts): Prompt[] {
  let list = catalog.prompts.slice();
  if (opts.start) {
    list = list.filter(p => typeof p.startN === 'number');
    list.sort((a, b) => (a.startN ?? 0) - (b.startN ?? 0));
    return list;
  }
  if (opts.q && opts.q.trim()) {
    const ql = opts.q.trim().toLowerCase();
    list = list.filter(p =>
      p.title.toLowerCase().includes(ql) ||
      p.prompt.toLowerCase().includes(ql) ||
      p.teaches.toLowerCase().includes(ql)
    );
  }
  if (opts.sel) {
    const tag = opts.sel;
    list = list.filter(p => {
      // sel 可以是 cat(understand/plan/...) 或 role(pm/design/...)
      if (CATS.includes(tag as Cat)) {
        const catMap: Record<string, string> = { understand: 'Understand', plan: 'Plan', prototype: 'Prototype', build: 'Implement', test: 'Test', refactor: 'Refactor', review: 'Review', steer: 'Steer', debug: 'Debug', git: 'Git', release: 'Release', data: 'Data', automate: 'Automate' };
        return p.cat === catMap[tag];
      }
      return p.roles.includes(tag);
    });
  }
  // 默认按 roles 数量升序,operate 在前
  list.sort((a, b) => {
    const ao = a.sdlc === 'operate' ? 0 : 1;
    const bo = b.sdlc === 'operate' ? 0 : 1;
    return ao - bo || a.roles.length - b.roles.length;
  });
  return list;
}

export function groupByPhaseAndCat(prompts: Prompt[]): Array<{ sdlc: Sdlc; cat: Cat; items: Prompt[] }> {
  const map = new Map<string, { sdlc: Sdlc; cat: Cat; items: Prompt[] }>();
  for (const p of prompts) {
    const k = `${p.sdlc}|${p.cat}`;
    if (!map.has(k)) map.set(k, { sdlc: p.sdlc, cat: p.cat, items: [] });
    map.get(k)!.items.push(p);
  }
  return Array.from(map.values());
}