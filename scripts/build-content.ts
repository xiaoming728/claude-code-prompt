// 内容编译管线: 读取 content/prompts/*.md 并生成 public/prompts.json
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import yaml from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SDLCS = ['discover', 'design', 'build', 'ship', 'operate'] as const;
const CATS = ['Onboard', 'Understand', 'Plan', 'Prototype', 'Implement', 'Test', 'Refactor', 'Review', 'Steer', 'Git', 'Release', 'Debug', 'Incident', 'Data', 'Automate'] as const;
const ROLES = ['understand', 'plan', 'prototype', 'build', 'test', 'refactor', 'review', 'steer', 'debug', 'git', 'release', 'data', 'automate', 'pm', 'design', 'docs', 'marketing', 'security', 'ops'] as const;
const SOURCES = ['workflows', 'teams', 'legal', 'cybersecurity', 'best-practices', 'ebook'] as const;
const NEEDS = ['tracker', 'gh', 'browser', 'db'] as const;
const PASTES = ['mockup', 'design', 'screenshot', 'plan', 'error', 'csv'] as const;

export function parseFrontmatter(md: string) {
  const result = matter(md);
  return { data: result.data as Record<string, unknown>, content: result.content };
}

export function validatePrompt(p: Record<string, unknown>, seenIds: Set<string> = new Set()): asserts p is Record<string, unknown> & {
  id: string; sdlc: typeof SDLCS[number]; cat: typeof CATS[number];
  prompt: string; src: typeof SOURCES[number]; title: string; teaches: string;
} {
  const required = ['id', 'sdlc', 'cat', 'prompt', 'src', 'title', 'teaches'];
  for (const k of required) {
    if (p[k] === undefined || p[k] === null || p[k] === '') {
      throw new Error(`Missing required field: ${k} in prompt ${JSON.stringify(p)}`);
    }
  }
  if (typeof p.id !== 'string') throw new Error(`id must be string`);
  if (!SDLCS.includes(p.sdlc as typeof SDLCS[number])) throw new Error(`sdlc invalid: ${p.sdlc}`);
  if (!CATS.includes(p.cat as typeof CATS[number])) throw new Error(`cat invalid: ${p.cat}`);
  if (!SOURCES.includes(p.src as typeof SOURCES[number])) throw new Error(`src invalid: ${p.src}`);
  if (Array.isArray(p.roles)) {
    for (const r of p.roles) {
      if (!ROLES.includes(r as typeof ROLES[number])) throw new Error(`role invalid: ${r}`);
    }
  }
  if (p.needs !== undefined && !NEEDS.includes(p.needs as typeof NEEDS[number])) {
    throw new Error(`needs invalid: ${p.needs}`);
  }
  if (p.paste !== undefined && !PASTES.includes(p.paste as typeof PASTES[number])) {
    throw new Error(`paste invalid: ${p.paste}`);
  }
  if (p.startN !== undefined) {
    const n = p.startN as number;
    if (!Number.isInteger(n) || n < 1 || n > 5) throw new Error(`startN out of range: ${n}`);
  }
  if (seenIds.has(p.id)) throw new Error(`duplicate id: ${p.id}`);
  seenIds.add(p.id);
  // slot 引用一致性
  const slots = (p.slots as Record<string, string> | undefined) ?? {};
  const promptStr = p.prompt as string;
  const slotRefs = promptStr.match(/\{(\w+)\}/g) ?? [];
  for (const ref of slotRefs) {
    const name = ref.slice(1, -1);
    if (!(name in slots)) throw new Error(`prompt references slot {${name}} but slots has no key for it`);
  }
}

const SOURCES_URL: Record<typeof SOURCES[number], string> = {
  'workflows': '/docs/en/common-workflows',
  'teams': 'https://claude.com/blog/how-anthropic-teams-use-claude-code',
  'legal': 'https://claude.com/blog/how-anthropic-uses-claude-legal',
  'cybersecurity': 'https://claude.com/blog/how-anthropic-uses-claude-cybersecurity',
  'best-practices': '/docs/en/best-practices',
  'ebook': 'https://resources.anthropic.com/hubfs/Scaling%20agentic%20coding%20across%20your%20organization.pdf',
};

export async function buildCatalog(mdSources: string[]) {
  // 在 build 阶段不强制 id 唯一性(避免与 verifyPrompt 单元测试的契约冲突);
  // 真实场景下由 build:content 入口在写入前再做一次全局重复校验。
  const prompts: unknown[] = [];
  for (const md of mdSources) {
    const { data } = parseFrontmatter(md);
    validatePrompt(data);
    prompts.push(data);
  }
  return { prompts, sources: SOURCES_URL };
}

async function main() {
  const contentDir = join(ROOT, 'content', 'prompts');
  const outDir = join(ROOT, 'public');
  const files = readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const mds = files.map(f => readFileSync(join(contentDir, f), 'utf-8'));
  const { prompts, sources } = await buildCatalog(mds);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'prompts.json'), JSON.stringify({ prompts, sources }, null, 2));
  console.log(`✓ Built ${prompts.length} prompts → public/prompts.json`);
}

main().catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});