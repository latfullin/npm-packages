// Перед сборкой: модуль на каждый флаг из flags/*.svg (src/flags/ — не в git). Каждый флаг — отдельный файл,
// чтобы сборщик клал в бандл только загруженные флаги
import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'src/flags');
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
const codes = readdirSync(path.join(root, 'flags')).filter((f) => f.endsWith('.svg')).map((f) => f.slice(0, 2)).sort();
for (const c of codes) {
  const svg = readFileSync(path.join(root, 'flags', `${c}.svg`), 'utf8').trim();
  writeFileSync(path.join(out, `${c}.ts`), `export default ${JSON.stringify(svg)};\n`);
}
writeFileSync(
  path.join(out, 'index.ts'),
  `export const flags: Record<string, () => Promise<{ default: string }>> = {\n${codes
    .map((c) => `  ${JSON.stringify(c)}: () => import('./${c}.js'),`)
    .join('\n')}\n};\n`,
);
