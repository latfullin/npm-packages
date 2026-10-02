// Сборка страниц сайта из content/: один исходник на страницу, языковые блоки ::: ru / ::: en / ...
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DefaultTheme } from 'vitepress';
import { packages } from '../../content';
import type { PackageMeta, PageRef, Tr } from '../../content/types';
import { fallbackLang, langs, prefix, type LangFile } from '../i18n';

export const contentDir = fileURLToPath(new URL('../../content', import.meta.url));

export function tr(text: Tr, code: string): string {
  return typeof text === 'string' ? text : (text[code] ?? text[fallbackLang]);
}

const slugOf = (p: PageRef) => (typeof p === 'string' ? p.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : p.slug);
const titleOf = (p: PageRef, code: string) => (typeof p === 'string' ? p : tr(p.title, code));

// Оставляет в markdown общие части и блок нужного языка (или языка по умолчанию, если перевода нет)
export function localize(md: string, code: string): string {
  const codes = new Set(langs.map((l) => l.code));
  const out: string[] = [];
  let group: Record<string, string[]> | null = null;
  let current: string[] | null = null;
  let depth = 0;
  let fence = false;

  const flush = () => {
    if (!group) return;
    const pick = group[code] ?? group[fallbackLang] ?? Object.values(group)[0];
    out.push(...pick, '');
    group = null;
  };

  for (const line of md.split('\n')) {
    if (current) {
      if (line.startsWith('```')) fence = !fence;
      if (!fence && /^:::+\s*\S/.test(line)) depth++;
      else if (!fence && /^:::+\s*$/.test(line)) {
        if (depth === 0) {
          current = null;
          continue;
        }
        depth--;
      }
      current.push(line);
      continue;
    }
    if (line.startsWith('```')) fence = !fence;
    const open = !fence && line.match(/^::: ([a-z]{2}(?:-[a-z]+)?)\s*$/);
    if (open && codes.has(open[1])) {
      // повторный блок того же языка — начало следующей группы, а не замена предыдущей
      if (group && open[1] in group) flush();
      group ??= {};
      current = group[open[1]] = [];
      continue;
    }
    // пустые строки между языковыми блоками не разрывают группу
    if (group && line.trim() === '') continue;
    flush();
    out.push(line);
  }
  flush();
  return out.join('\n');
}

function render(md: string, t: LangFile, pkg: PackageMeta): string {
  return localize(md, t.code)
    .replace(/@t\((\w+)\)/g, (s, key) => t.docs[key as keyof LangFile['docs']] ?? s)
    .replace(/\]\(~\//g, `](${prefix(t.code)}/${pkg.name}/`)
    // ссылка на другой пакет сайта: [object](@/tinyval/schemas/object)
    .replace(/\]\(@\//g, `](${prefix(t.code)}/`)
    .replace(/\n{3,}/g, '\n\n');
}

const read = (file: string) => fs.readFileSync(path.join(contentDir, file), 'utf-8');

const page = (title: string, body: string) => `---\ntitle: ${JSON.stringify(title)}\n---\n\n# ${title}\n\n${body}`;

function home(t: LangFile): string {
  const base = prefix(t.code);
  const features = packages
    .map((p) => `  - title: ${p.name}\n    details: ${JSON.stringify(tr(p.description, t.code))}\n    link: ${base}/${p.name}/`)
    .join('\n');
  return `---
layout: home
hero:
  name: kilkenny packages
  tagline: ${JSON.stringify(t.home.tagline)}
  actions:
    - theme: brand
      text: ${JSON.stringify(t.home.action)}
      link: ${base}/${packages[0].name}/
features:
${features}
---
`;
}

export interface PageEntry {
  params: { page: string };
  content: string;
}

// Все страницы сайта на всех языках
export function allPages(): PageEntry[] {
  const pages: PageEntry[] = [];
  for (const t of langs) {
    const base = prefix(t.code).slice(1);
    const at = (p: string) => (base ? `${base}/${p}` : p);
    pages.push({ params: { page: at('index') }, content: home(t) });
    for (const pkg of packages) {
      pages.push({
        params: { page: at(`${pkg.name}/index`) },
        content: page(pkg.name, render(read(`${pkg.name}/index.md`), t, pkg)),
      });
      for (const section of pkg.sections) {
        for (const p of section.pages) {
          const slug = slugOf(p);
          pages.push({
            params: { page: at(`${pkg.name}/${section.dir}/${slug}`) },
            content: page(titleOf(p, t.code), render(read(`${pkg.name}/${section.dir}/${slug}.md`), t, pkg)),
          });
        }
      }
    }
  }
  return pages;
}

export function sidebar(pkg: PackageMeta, code: string): DefaultTheme.SidebarItem[] {
  const base = `${prefix(code)}/${pkg.name}`;
  return [
    { text: tr(pkg.intro, code), link: `${base}/` },
    ...pkg.sections.map((s) => ({
      text: tr(s.title, code),
      collapsed: false,
      items: s.pages.map((p) => ({ text: titleOf(p, code), link: `${base}/${s.dir}/${slugOf(p)}` })),
    })),
  ];
}
