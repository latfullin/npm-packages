// Генерация таблицы стран (src/countries.ts) и флагов (flags/*.svg) из данных libphonenumber-js и country-flag-icons.
// Запуск: npm run generate -w packages/tinyval-phone — после обновления этих пакетов. Результат коммитится
import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { getExampleNumber, getCountries, getCountryCallingCode, Metadata } from 'libphonenumber-js/max';
import examples from 'libphonenumber-js/mobile/examples';
import { phoneTable as handmade } from 'tinyval-mask/presets';

const root = path.resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const digits = (s) => s.replace(/\D/g, '');
const md = new Metadata();

// Национальный формат без приставки: 8 029 491-19-11 → 29 491-19-11. Если формат не сводится к номеру — международный
function format(example) {
  const nn = example.nationalNumber;
  const national = example.format('NATIONAL');
  const d = digits(national);
  if (d.endsWith(nn)) {
    let skip = d.length - nn.length;
    let i = 0;
    while (skip) if (/\d/.test(national[i++])) skip--;
    let s = national.slice(i).replace(/^[\s\-.]+/, '');
    // скобка приставки: (025) → (25)
    if (s.includes(')') && !s.slice(0, s.indexOf(')')).includes('(')) s = `(${s}`;
    return s;
  }
  const intl = example.formatInternational().replace(`+${example.countryCallingCode}`, '').trim();
  if (digits(intl) !== nn) throw new Error(`формат ${example.country}: ${intl}`);
  return intl;
}

// Шаблон маски: цифры → 9; длина короче примера (на одну цифру) и длиннее — необязательные цифры [9]
function pattern(formatted, lengths) {
  const len = digits(formatted).length;
  const min = Math.max(Math.min(...lengths, len), len - 1);
  const max = Math.max(...lengths, len);
  let out = '';
  let pending = '';
  let i = 0;
  for (const ch of formatted) {
    if (!/\d/.test(ch)) {
      pending += /[9a*[\]\\]/.test(ch) ? `\\${ch}` : ch;
      continue;
    }
    out += i < min ? `${pending}9` : `[${pending}9]`;
    pending = '';
    i++;
  }
  for (; i < max; i++) out += '[9]';
  return out;
}

// Признак страны без «начала номера» — её шаблоны городских и мобильных номеров целиком,
// кроме совпадающих с главной страной кода (мобильные Западной Сахары — те же, что у Марокко)
const types = ['FIXED_LINE', 'MOBILE'];
function typePatterns(C) {
  md.selectNumberingPlan(C);
  return types.map((t) => md.numberingPlan.type(t)?.pattern());
}
function ownPatterns(C, main) {
  const theirs = typePatterns(main);
  // и не подходят под пример номера главной страны: мобильные Ватикана записаны иначе, но это номера Италии
  const sample = getExampleNumber(main, examples).nationalNumber;
  const mine = typePatterns(C).filter((p, i) => p && p !== theirs[i] && !new RegExp(`^(?:${p})$`).test(sample));
  md.selectNumberingPlan(C);
  if (!mine.length) return '';
  return `(?:${mine.join('|')})$`;
}

const rows = [];
for (const C of getCountries()) {
  const c = C.toLowerCase();
  const example = getExampleNumber(C, examples);
  if (!example) throw new Error(`нет примера номера: ${C}`);
  md.selectNumberingPlan(C);
  const plan = md.numberingPlan;
  const dial = getCountryCallingCode(C);
  const lengths = plan.type('MOBILE')?.possibleLengths() || plan.possibleLengths();
  // главная страна кода (+1 — США) определяется по умолчанию; остальные — по началу номера или по всему номеру
  const main = md.getCountryCodesForCallingCode(dial)[0];
  // начала номера хватает, если под него подходит пример номера страны; иначе (остров Мэн) — ещё и шаблоны номеров
  const lead = plan.leadingDigits();
  const detect =
    main === C ? '' : lead && new RegExp(`^(?:${lead})`).test(example.nationalNumber) ? lead : [lead, ownPatterns(C, main)].filter(Boolean).join('|');
  const own = handmade[c];
  rows.push([c, dial, own?.[1] ?? pattern(format(example), lengths), own ? own[2] ?? '' : plan.nationalPrefix() || '', own?.[3] ?? detect]);
}

const q = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const line = ([c, ...rest]) => {
  while (rest.length > 2 && !rest[rest.length - 1]) rest.pop();
  return `  ${/^[a-z]+$/.test(c) && c !== 'in' ? c : q(c)}: [${rest.map(q).join(', ')}],`;
};
writeFileSync(
  path.join(root, 'src/countries.ts'),
  `// Сгенерировано scripts/generate.mjs из метаданных libphonenumber-js (Apache-2.0) — не править вручную.
// Страны из tinyval-mask сохраняют его форматы: +7 (999) 999-99-99
import type { PhoneTable } from 'tinyval-mask/presets';

export const phoneTable = {
${rows.map(line).join('\n')}
} as const satisfies PhoneTable;
`,
);

// Флаги: country-flag-icons/3x2, только коды из двух букв
const src = path.join(path.dirname(require.resolve('country-flag-icons/package.json')), '3x2');
const out = path.join(root, 'flags');
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
let n = 0;
for (const f of readdirSync(src)) {
  if (!/^[A-Z]{2}\.svg$/.test(f)) continue;
  const svg = readFileSync(path.join(src, f), 'utf8').trim();
  if (/<script|on\w+=/i.test(svg)) throw new Error(`подозрительный SVG: ${f}`);
  writeFileSync(path.join(out, f.toLowerCase()), `${svg}\n`);
  n++;
}
const missing = rows.filter(([c]) => !readdirSync(out).includes(`${c}.svg`)).map(([c]) => c);
console.log(`стран: ${rows.length}, флагов: ${n}${missing.length ? `, без флага: ${missing.join(' ')}` : ''}`);
