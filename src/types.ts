export type Sdlc = 'discover' | 'design' | 'build' | 'ship' | 'operate';
export type Cat = 'Onboard' | 'Understand' | 'Plan' | 'Prototype' | 'Implement'
                | 'Test' | 'Refactor' | 'Review' | 'Steer' | 'Git' | 'Release'
                | 'Debug' | 'Incident' | 'Data' | 'Automate';
export type Role = 'understand' | 'plan' | 'prototype' | 'build' | 'test'
                | 'refactor' | 'review' | 'steer' | 'debug' | 'git'
                | 'release' | 'data' | 'automate' | 'pm' | 'design'
                | 'docs' | 'marketing' | 'security' | 'ops';
export type Source = 'workflows' | 'teams' | 'legal' | 'cybersecurity'
                   | 'best-practices' | 'ebook';
export type Needs = 'tracker' | 'gh' | 'browser' | 'db';
export type Paste = 'mockup' | 'design' | 'screenshot' | 'plan' | 'error' | 'csv';

export interface Prompt {
  id: string;
  sdlc: Sdlc;
  cat: Cat;
  startN?: number;
  roles: Role[];
  prompt: string;
  slots?: Record<string, string>;
  needs?: Needs;
  paste?: Paste;
  nextHref?: string;
  src: Source;
  title: string;
  teaches: string;
  next?: string;
}

export interface I18nLabels {
  search: string;
  startHere: string;
  startHereHeader: string;
  showAll: (n: number) => string;
  clear: string;
  prompt: string;
  prompts: string;
  noMatch: (q: string) => string;
  fillAndCopy: string;
  copyThis: string;
  hintBefore: string;
  hintChip: string;
  hintAfter: string;
  copy: string;
  copied: string;
  whyWorks: string;
  makeItStick: string;
  from: string;
  paste: Record<Paste, string>;
  needsLabel: string;
  needs: Record<Needs, string>;
}

export interface I18nTaxonomy {
  tagLabels: Record<Role, string>;
  phaseLabels: Record<Sdlc, string>;
  sourceLabels: Record<Source, string>;
  catLabels: Record<Cat, string>;
}

export interface PromptCatalog {
  prompts: Prompt[];
  sources: Record<Source, string>;
  labels: I18nLabels;
  taxonomy: I18nTaxonomy;
}

export interface Override {
  slots?: Record<string, string>;
  prompt?: string;
}

export type Theme = 'system' | 'light' | 'dark';

export interface SectionCommand {
  name: string;
  description: string;
  example?: string;
  slots?: Record<string, string>;
}

export interface SectionContent {
  id: string;
  label: string;
  repoUrl: string;
  intro: string;
  install: SectionCommand[];
  skills: SectionCommand[];
  usage: SectionCommand[];
}