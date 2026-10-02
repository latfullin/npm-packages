// Проверка собранного сайта: каждый заголовок из content/ на каждом языке должен оказаться на готовой странице.
// Ловит потерянные языковые блоки и заголовки, которые markdown понял не так. Запуск: npm run check -w site (после build)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const site = fileURLToPath(new URL('../..', import.meta.url));
const content = path.join(site, 'content');
const dist = path.join(site, '.vitepress/dist');
const langs = { ru: '', en: 'en/', zh: 'zh/' };

const files = fs.readdirSync(content, { recursive: true }).filter((f) => f.endsWith('.md'));
const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)).replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

let total = 0;
const problems = [];
for (const file of files) {
  const lines = fs.readFileSync(path.join(content, file), 'utf-8').split('\n');
  for (const [lang, prefix] of Object.entries(langs)) {
    const out = path.join(dist, prefix + file.replace(/\.md$/, '.html'));
    if (!fs.existsSync(out)) {
      problems.push(`${lang}: ${file} — страница не собрана`);
      continue;
    }
    const page = decode(fs.readFileSync(out, 'utf-8'));
    let block = null;
    let fence = false;
    for (const line of lines) {
      const open = !fence && line.match(/^::: (ru|en|zh)\s*$/);
      if (open && !block) {
        block = open[1];
        continue;
      }
      if (block && !fence && line.trim() === ':::') {
        block = null;
        continue;
      }
      if (line.startsWith('```')) fence = !fence;
      if (fence) continue;
      const h = line.match(/^#{2,3} (.+)$/);
      if (!h || h[1].includes('@t(') || (block && block !== lang)) continue;
      total++;
      const text = h[1].replace(/`/g, '').trim();
      if (!page.includes(text)) problems.push(`${lang}: ${file} — нет заголовка «${text}»`);
    }
  }
}

console.log(`Проверено заголовков: ${total}`);
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
