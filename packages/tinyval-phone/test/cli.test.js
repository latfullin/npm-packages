import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mask, isValid } from 'tinyval-mask';
import { phone, phoneAuto, detectCountry, phoneCountries, setCountries, getCountries, phoneTable } from '../dist/index.js';
import { loadFlag, setFlags, resetFlags, flagCodes } from '../dist/flag-icons.js';

const cli = fileURLToPath(new URL('../dist/cli.js', import.meta.url));
const run = (cwd, ...args) => {
  try {
    return { code: 0, out: execFileSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8', stdio: 'pipe' }) };
  } catch (e) {
    return { code: e.status, out: e.stderr };
  }
};
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'tinyval-phone-'));

test('cli countries: файл со всеми или выбранными странами', async () => {
  const dir = tmp();
  assert.equal(run(dir, 'countries', '--js').code, 0);
  const all = (await import(pathToFileURL(path.join(dir, 'phones/countries.js')))).default;
  assert.equal(Object.keys(all).length, 245);
  assert.deepEqual(all.ru, ['7', '(999) 999-99-99', '[78]']);
  assert.deepEqual(all.bs, [...phoneTable.bs]);

  assert.equal(run(dir, 'countries', 'JP', 'de', '--out', 'src/phones').code, 0);
  const ts = fs.readFileSync(path.join(dir, 'src/phones/countries.ts'), 'utf8');
  assert.match(ts, /satisfies Countries;/);
  assert.match(ts, /import countries from '\.\/src\/phones\/countries';/);
  assert.match(ts, /  jp: \['81', '99-9999-9999', '0'\],\n  de: /);

  assert.equal(run(dir, 'countries', 'ru', '--js').code, 1, 'файл уже есть');
  assert.equal(run(dir, 'countries', 'ru', '--js', '--force').code, 0);
  assert.equal(run(dir, 'countries', 'zz').code, 1, 'нет такой страны');
});

test('cli flags: модуль с SVG выбранных флагов, файлы .svg', async () => {
  const dir = tmp();
  assert.equal(run(dir, 'flags').code, 1, 'без кодов — подсказка');
  assert.equal(run(dir, 'flags', 'ru', 'kz', '--js').code, 0);
  const flags = (await import(pathToFileURL(path.join(dir, 'phones/flags.js')))).default;
  assert.deepEqual(Object.keys(flags), ['ru', 'kz']);
  assert.match(flags.ru, /^<svg/);
  assert.equal(run(dir, 'flags', '--all', '--svg', '--out', 'public/flags').code, 0);
  assert.equal(fs.readdirSync(path.join(dir, 'public/flags')).length, flagCodes().length);
});

test('setCountries: поменять формат, добавить и убрать страну', () => {
  const before = getCountries();
  setCountries({
    de: ['49', '9999 9999999[9]', '0'],
    xk: null,
    // своя «страна» с общим кодом +7: номера +7 940 — Абхазия
    ab: ['7', '(999) 999-99-99', '[78]', '940'],
  });
  assert.equal(mask('015123456789', phone('de')), '+49 1512 3456789');
  assert.equal(detectCountry('+383 43 201 234'), undefined);
  assert.equal(detectCountry('+7 940 123 45 67'), 'ab');
  assert.equal(detectCountry('+7 999 123 45 67'), 'ru');
  assert.equal(phoneAuto().country('+7 940').code, 'ab');
  assert.equal(phoneCountries().length, 245);

  setCountries({ ru: phoneTable.ru, kz: phoneTable.kz }, { replace: true });
  assert.equal(phoneCountries().length, 2);
  assert.equal(isValid('+44 7400 123456', phoneAuto()), false, 'Британии больше нет');

  setCountries(before, { replace: true });
  assert.equal(phoneCountries().length, 245);
});

test('setFlags: свои флаги, загрузчик, удаление', async () => {
  setFlags({ ru: '<svg id="my-ru"/>', xx: () => Promise.resolve('<svg id="xx"/>'), su: null, kz: null });
  assert.equal(await loadFlag('RU'), '<svg id="my-ru"/>');
  assert.equal(await loadFlag('xx'), '<svg id="xx"/>');
  assert.equal(await loadFlag('kz'), undefined);
  assert.ok(flagCodes().includes('xx'));
  assert.ok(!flagCodes().includes('kz'));
  assert.match(await loadFlag('jp'), /^<svg[^>]*viewBox/, 'остальные — встроенные');

  setFlags((code) => (code === 'jp' ? '<svg id="loader-jp"/>' : undefined));
  assert.equal(await loadFlag('jp'), '<svg id="loader-jp"/>');
  assert.equal(await loadFlag('ru'), '<svg id="my-ru"/>', 'флаг по коду важнее загрузчика');
  assert.match(await loadFlag('br'), /viewBox/, 'загрузчик вернул undefined — встроенный');

  resetFlags();
  assert.match(await loadFlag('kz'), /viewBox/);
  assert.equal(await loadFlag('xx'), undefined);
});
