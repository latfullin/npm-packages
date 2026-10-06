import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getExampleNumber, parsePhoneNumber } from 'libphonenumber-js/max';
import examples from 'libphonenumber-js/mobile/examples';
import { mask, unmask, isComplete, isValid } from 'tinyval-mask';
import { phone, phoneAuto, detectCountry, phoneCountries, phoneTable, flag, countryName } from '../dist/index.js';
import { loadFlag, flagCodes } from '../dist/flag-icons.js';

const codes = Object.keys(phoneTable);
const auto = phoneAuto();

test('245 стран, у каждой есть флаг', () => {
  assert.equal(codes.length, 245);
  const missing = codes.filter((c) => !flagCodes().includes(c));
  assert.deepEqual(missing, []);
});

test('пример мобильного номера каждой страны: маска заполнена, страна — как в libphonenumber', () => {
  const wrong = [];
  for (const c of codes) {
    const ex = getExampleNumber(c.toUpperCase(), examples);
    const full = `+${ex.countryCallingCode}${ex.nationalNumber}`;
    const own = phone(c);
    const masked = mask(full, own);
    const problems = [];
    if (!isComplete(full, own)) problems.push(`phone не заполнен: ${masked}`);
    if (unmask(full, own) !== full.slice(1)) problems.push(`phone raw ${unmask(full, own)}`);
    if (mask(full, auto) !== masked) problems.push(`phoneAuto ${mask(full, auto)} ≠ ${masked}`);
    if (!isValid(full, auto)) problems.push('phoneAuto не valid');
    // номера некоторых стран неотличимы от главной страны кода (Аланды — Финляндия): ждём эту страну или ту, что определяет libphonenumber
    const expected = parsePhoneNumber(full).country.toLowerCase();
    if (detectCountry(full) !== c && detectCountry(full) !== expected) problems.push(`страна ${detectCountry(full)}, libphonenumber: ${expected}`);
    if (problems.length) wrong.push(`${c} ${full}: ${problems.join('; ')}`);
  }
  assert.deepEqual(wrong, []);
});

test('страны с общим кодом: +1, +7, +44', () => {
  assert.equal(detectCountry('+1 201 555 0123'), 'us');
  assert.equal(detectCountry('+1 242 359 1234'), 'bs');
  assert.equal(detectCountry('+1 416 555 0123'), 'ca');
  assert.equal(detectCountry('+1 416'), 'us', 'Канада — когда номер введён целиком');
  assert.equal(detectCountry('+7 999 123 45 67'), 'ru');
  assert.equal(detectCountry('+7 701 123 45 67'), 'kz');
  assert.equal(detectCountry('+44 7400 123456'), 'gb');
  assert.equal(detectCountry('+44 7797 712345'), 'je');
  assert.equal(detectCountry('+44 7624 123456'), 'im');
});

test('форматы tinyval-mask сохраняются, приставка 0 / 8 отбрасывается', () => {
  assert.equal(mask('89991234567', phoneAuto({ defaultCountry: 'ru' })), '+7 (999) 123-45-67');
  assert.equal(mask('09012345678', phoneAuto({ defaultCountry: 'jp' })), '+81 90-1234-5678');
  assert.equal(mask('0612345678', phone('fr')), '+33 6 12 34 56 78');
  assert.equal(mask('+55 11961234567', auto), '+55 (11) 96123-4567');
});

test('страна, флаг и название', () => {
  const m = phoneAuto({ defaultCountry: 'jp' });
  assert.deepEqual(m.country(''), { code: 'jp', dial: '81', flag: '🇯🇵' });
  assert.equal(m.country('+55 11').code, 'br');
  assert.equal(flag('br'), '🇧🇷');
  assert.equal(countryName('br', 'ru'), 'Бразилия');
  assert.equal(phoneCountries().length, 245);
});

test('loadFlag: SVG по коду, неизвестный код — undefined', async () => {
  const svg = await loadFlag('RU');
  assert.match(svg, /^<svg[^>]*viewBox="0 0 513 342"/);
  assert.equal(await loadFlag('zz'), undefined);
});
