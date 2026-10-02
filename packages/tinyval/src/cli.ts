#!/usr/bin/env node
// npx tinyval lang <locale> — копирует lang-файл в проект, чтобы поменять тексты ошибок (как php artisan lang:publish)
import fs from 'node:fs';
import path from 'node:path';
import type { Message } from './core.js';
import en from './locales/en.js';
import ru from './locales/ru.js';
import zh from './locales/zh.js';

const locales: Record<string, Record<string, Message>> = { en, ru, zh };

const HELP = `Usage: npx tinyval lang <locale> [options]

Copies a tinyval locale into your project so you can edit the error messages.

Locales: ${Object.keys(locales).join(', ')}

Options:
  --out <dir>  Target directory (default: lang/tinyval)
  --js         Write a .js file instead of .ts
  --force      Overwrite an existing file
`;

const quote = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

function render(locale: string, js: boolean, importPath: string): string {
  const body = Object.entries(locales[locale])
    .map(([k, v]) => `  ${k}: ${quote(String(v))},`)
    .join('\n');
  const head = `// tinyval error messages (${locale}). Edit freely, then load once on startup:
//
//   import { setMessages } from 'tinyval';
//   import messages from '${importPath}';
//   setMessages(messages);
//
// Keys: an error code ('required') or a field + code ('email.required', 'items.*.name.required').
// Placeholders: {label} — field name, and rule params such as {min}, {max}, {options}.
`;
  return js
    ? `${head}\n/** @type {import('tinyval').Messages} */\nexport default {\n${body}\n};\n`
    : `${head}import type { Messages } from 'tinyval';\n\nexport default {\n${body}\n} satisfies Messages;\n`;
}

function main(args: string[]): number {
  const [command, locale] = args;
  if (!command || command === '--help' || command === '-h') {
    process.stdout.write(HELP);
    return 0;
  }
  if (command !== 'lang' || !locale || !locales[locale]) {
    process.stderr.write(locale && command === 'lang' ? `Unknown locale "${locale}".\n\n${HELP}` : HELP);
    return 1;
  }
  const outIndex = args.indexOf('--out');
  const dir = outIndex > -1 && args[outIndex + 1] ? args[outIndex + 1] : 'lang/tinyval';
  const js = args.includes('--js');
  const file = path.resolve(dir, `${locale}.${js ? 'js' : 'ts'}`);
  if (fs.existsSync(file) && !args.includes('--force')) {
    process.stderr.write(`${path.relative(process.cwd(), file)} already exists. Use --force to overwrite.\n`);
    return 1;
  }
  let importPath = path.relative(process.cwd(), file).replace(/\\/g, '/').replace(/\.(ts|js)$/, js ? '.js' : '');
  if (!importPath.startsWith('.')) importPath = `./${importPath}`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, render(locale, js, importPath));
  process.stdout.write(`Created ${path.relative(process.cwd(), file)}\n`);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
