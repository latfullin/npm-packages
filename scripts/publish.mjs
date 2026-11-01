// Публикация на npm пакетов, чьей версии ещё нет в реестре — в порядке зависимостей.
// Запуск: node scripts/publish.mjs [--dry-run] (после сборки пакетов). Из GitHub Actions — .github/workflows/publish.yml
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dryRun = process.argv.includes('--dry-run');

// сначала пакеты, от которых зависят остальные (peerDependencies)
const order = ['tinyval', 'tinyval-mask', 'tinyval-vue', 'tinyval-phone'];
const dirs = readdirSync(`${root}packages`).filter((d) => !d.startsWith('.'));
const missing = dirs.filter((d) => !order.includes(d));
if (missing.length) throw new Error(`Добавьте в order в scripts/publish.mjs: ${missing.join(', ')}`);

const npm = (args, opts = {}) => execFileSync('npm', args, { cwd: root, encoding: 'utf8', ...opts });

// Версия уже на npm: пустой ответ — пакет есть, версии нет; E404 — пакета ещё нет
function published(name, version) {
  try {
    return npm(['view', `${name}@${version}`, 'version'], { stdio: ['ignore', 'pipe', 'pipe'] }).trim() === version;
  } catch (e) {
    if (String(e.stderr).includes('E404')) return false;
    throw e;
  }
}

let count = 0;
for (const dir of order) {
  const { name, version, private: isPrivate } = JSON.parse(readFileSync(`${root}packages/${dir}/package.json`, 'utf8'));
  if (isPrivate) continue;
  if (published(name, version)) {
    console.log(`${name}@${version} — уже на npm`);
    continue;
  }
  // 0.2.0-beta.1 — под тегом next, чтобы npm install не ставил его по умолчанию
  const tag = version.includes('-') ? ['--tag', 'next'] : [];
  console.log(`${name}@${version} — публикую${dryRun ? ' (dry run)' : ''}`);
  npm(['publish', '-w', name, ...tag, ...(dryRun ? ['--dry-run'] : [])], { stdio: 'inherit' });
  count++;
}
console.log(count ? `Опубликовано: ${count}${dryRun ? ' (dry run)' : ''}` : 'Нечего публиковать: все версии уже на npm');
