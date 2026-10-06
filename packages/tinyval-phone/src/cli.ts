#!/usr/bin/env node
// npx tinyval-phone countries | flags — копирует данные пакета в проект, чтобы поменять их (как npx tinyval lang)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { phoneTable } from './countries.js';

const flagsDir = fileURLToPath(new URL('../flags/', import.meta.url));
const flagList = () => fs.readdirSync(flagsDir).filter((f) => f.endsWith('.svg')).map((f) => f.slice(0, -4)).sort();

const HELP = `Usage:
  npx tinyval-phone countries [codes...] [options]   Copy country phone formats to edit, add or remove countries
  npx tinyval-phone flags <codes...|--all> [options] Copy flag icons to replace them

Examples:
  npx tinyval-phone countries              all 245 countries
  npx tinyval-phone countries ru kz by     only these (the rest stay as in the package)
  npx tinyval-phone flags ru kz            flags as SVG strings for setFlags
  npx tinyval-phone flags --all --svg      .svg files, e.g. for <img> or a graphics editor

Options:
  --out <dir>  Target directory (default: phones)
  --js         Write a .js file instead of .ts
  --svg        flags: copy .svg files instead of a module
  --force      Overwrite existing files
`;

const quote = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const key = (c: string) => (/^[a-z_$][\w$]*$/.test(c) && c !== 'in' ? c : quote(c));

function head(what: string, setter: string, importPath: string, extra: string): string {
  return `// tinyval-phone ${what}. Edit freely, then load once on startup, before creating masks:
//
//   import { ${setter} } from 'tinyval-phone${setter === 'setFlags' ? '/flags' : ''}';
//   import ${what} from '${importPath}';
//   ${setter}(${what});
//
${extra}`;
}

function countries(codes: string[], js: boolean, importPath: string): string {
  const body = codes
    .map((c) => {
      const entry = [...phoneTable[c as keyof typeof phoneTable]] as string[];
      while (entry.length > 2 && !entry[entry.length - 1]) entry.pop();
      return `  ${key(c)}: [${entry.map(quote).join(', ')}],`;
    })
    .join('\n');
  const extra = `// Entry: [dial code, pattern after the code, national prefix, country sign]
//   pattern: 9 — digit, [9] — optional digit, '\\\\9' in a string — a literal nine
//   national prefix — what is dialed before a local number (0, 8); it's dropped: 07400… → +44 7400…
//   country sign — for countries sharing a dial code: the beginning of the national number ('242' — Bahamas),
//   or the whole number if it ends with $. Both are regular expressions over digits without the country code.
// Add a country: a new key (ISO 3166-1 alpha-2, lowercase). Remove one: set it to null.
// Only your countries, without the rest of the world: setCountries(countries, { replace: true }).
`;
  return js
    ? `${head('countries', 'setCountries', importPath, extra)}\n/** @type {import('tinyval-phone').Countries} */\nexport default {\n${body}\n};\n`
    : `${head('countries', 'setCountries', importPath, extra)}import type { Countries } from 'tinyval-phone';\n\nexport default {\n${body}\n} satisfies Countries;\n`;
}

function flags(codes: string[], js: boolean, importPath: string): string {
  const body = codes.map((c) => `  ${key(c)}: ${quote(fs.readFileSync(path.join(flagsDir, `${c}.svg`), 'utf8').trim())},`).join('\n');
  const extra = `// Values: SVG markup, a function that loads it, or null for no flag. All flags in this file get into your bundle,
// so keep only the ones you change. Your own loader for every flag: setFlags((code) => …).
`;
  return js
    ? `${head('flags', 'setFlags', importPath, extra)}\n/** @type {import('tinyval-phone/flags').Flags} */\nexport default {\n${body}\n};\n`
    : `${head('flags', 'setFlags', importPath, extra)}import type { Flags } from 'tinyval-phone/flags';\n\nexport default {\n${body}\n} satisfies Flags;\n`;
}

function write(file: string, content: string | Buffer, force: boolean): boolean {
  const rel = path.relative(process.cwd(), file);
  if (fs.existsSync(file) && !force) {
    process.stderr.write(`${rel} already exists. Use --force to overwrite.\n`);
    return false;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return true;
}

function main(args: string[]): number {
  const [command] = args;
  if (!command || command === '--help' || command === '-h') {
    process.stdout.write(HELP);
    return 0;
  }
  if (command !== 'countries' && command !== 'flags') {
    process.stderr.write(`Unknown command "${command}".\n\n${HELP}`);
    return 1;
  }
  const outIndex = args.indexOf('--out');
  const dir = outIndex > -1 && args[outIndex + 1] ? args[outIndex + 1] : 'phones';
  const js = args.includes('--js');
  const force = args.includes('--force');
  const codes = args.slice(1).filter((a, i, all) => !a.startsWith('--') && all[i - 1] !== '--out').map((c) => c.toLowerCase());
  const known = command === 'countries' ? Object.keys(phoneTable) : flagList();
  const unknown = codes.filter((c) => !known.includes(c));
  if (unknown.length) {
    process.stderr.write(`Unknown ${command === 'countries' ? 'country' : 'flag'}: ${unknown.join(', ')}.\n`);
    return 1;
  }
  const all = codes.length ? codes : command === 'countries' || args.includes('--all') ? known : [];
  if (!all.length) {
    process.stderr.write(`Pass the flags to replace (npx tinyval-phone flags ru kz) or --all.\n`);
    return 1;
  }

  if (command === 'flags' && args.includes('--svg')) {
    let n = 0;
    for (const c of all) if (write(path.resolve(dir, `${c}.svg`), fs.readFileSync(path.join(flagsDir, `${c}.svg`)), force)) n++;
    process.stdout.write(`Copied ${n} flags to ${path.relative(process.cwd(), path.resolve(dir)) || '.'}\n`);
    return n === all.length ? 0 : 1;
  }

  const file = path.resolve(dir, `${command}.${js ? 'js' : 'ts'}`);
  let importPath = path.relative(process.cwd(), file).replace(/\\/g, '/').replace(/\.(ts|js)$/, js ? '.js' : '');
  if (!importPath.startsWith('.')) importPath = `./${importPath}`;
  const content = command === 'countries' ? countries(all, js, importPath) : flags(all, js, importPath);
  if (!write(file, content, force)) return 1;
  process.stdout.write(`Created ${path.relative(process.cwd(), file)}\n`);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
