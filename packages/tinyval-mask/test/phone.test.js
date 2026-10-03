import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mask, unmask, isComplete } from '../dist/index.js';
import { phone, phoneAuto, phoneCountries, detectCountry, flag, countryName } from '../dist/presets.js';

test('detectCountry: самый длинный подходящий код, +7 — Россия или Казахстан', () => {
  assert.equal(detectCountry('375291234567'), 'by');
  assert.equal(detectCountry('+380 67'), 'ua');
  assert.equal(detectCountry('79991234567'), 'ru');
  assert.equal(detectCountry('77011234567'), 'kz');
  assert.equal(detectCountry('76'), 'kz');
  assert.equal(detectCountry('7'), 'ru');
  assert.equal(detectCountry('12025550123'), 'us');
  assert.equal(detectCountry('12025550123', ['ca', 'us']), 'ca', 'при общем коде — первая из списка');
  assert.equal(detectCountry('37'), undefined, 'код ещё не дописан');
  assert.equal(detectCountry('375', ['ru']), undefined, 'страны вне списка не определяются');
});

test('phoneAuto: маска меняется по коду страны', () => {
  const m = phoneAuto();
  assert.equal(mask('+3', m), '+3');
  assert.equal(mask('+375', m), '+375');
  assert.equal(mask('+375291234567', m), '+375 (29) 123-45-67');
  assert.equal(mask('79991234567', m), '+7 (999) 123-45-67', 'без + — код страны в начале');
  assert.equal(mask('77011234567', m), '+7 (701) 123-45-67');
  assert.equal(mask('+4915123456789', m), '+49 151 23456789');
  assert.equal(mask('+998901234567', m), '+998 (90) 123-45-67', 'девятки кода — не позиции для ввода');
  assert.equal(mask('+90 532 123 45 67', m), '+90 (532) 123 45 67');
  assert.equal(unmask('+375 (29) 123-45-67', m), '375291234567');
  assert.equal(unmask('+375', m), '', 'один код страны — пустое значение');
  assert.equal(isComplete('+375 (29) 123-45-67', m), true);
  assert.equal(isComplete('+375 (29) 123', m), false);
});

test('phoneAuto: страна по умолчанию', () => {
  const ru = phoneAuto({ defaultCountry: 'ru' });
  assert.equal(mask('9991234567', ru), '+7 (999) 123-45-67', 'местный номер');
  assert.equal(mask('89991234567', ru), '+7 (999) 123-45-67');
  assert.equal(mask('+375291234567', ru), '+375 (29) 123-45-67', 'с + — международный');
  const by = phoneAuto({ defaultCountry: 'by' });
  assert.equal(mask('291234567', by), '+375 (29) 123-45-67');
  assert.equal(mask('375291234567', by), '+375 (29) 123-45-67', 'код уже есть — не дублируется');
  assert.equal(phoneAuto({ defaultCountry: 'ru' }).template('', '_'), '+7 (___) ___-__-__', 'пустое поле — шаблон страны по умолчанию');
  assert.equal(mask('+7 (+375291234567', ru), '+375 (29) 123-45-67', '+ в середине — ввод номера другой страны');
});

test('phoneAuto.country: данные для флага и названия', () => {
  const m = phoneAuto();
  assert.deepEqual(m.country('+375 (29) 123'), { code: 'by', dial: '375', flag: '🇧🇾' });
  assert.equal(m.country('+3'), undefined);
  assert.equal(m.country(''), undefined);
  assert.equal(phoneAuto({ defaultCountry: 'ru' }).country('999')?.code, 'ru');
  assert.equal(phoneAuto({ defaultCountry: 'by' }).country('')?.code, 'by', 'пустое поле — флаг страны по умолчанию');
});

test('флаги, названия и список стран', () => {
  assert.equal(flag('ru'), '🇷🇺');
  assert.equal(flag('US'), '🇺🇸');
  assert.equal(countryName('by', 'ru'), 'Беларусь');
  assert.equal(countryName('de', 'en'), 'Germany');
  assert.equal(countryName('xx-bad'), 'XX-BAD', 'неизвестный код не роняет');
  const list = phoneCountries();
  assert.ok(list.length >= 25);
  assert.deepEqual(list[0], { code: 'ru', dial: '7', flag: '🇷🇺' });
});

test('phone(): новые страны', () => {
  assert.equal(mask('15123456789', phone('de')), '+49 151 23456789');
  assert.equal(mask('612345678', phone('fr')), '+33 6 12 34 56 78');
  assert.equal(mask('555123456', phone('kg')), '+996 (555) 123-456');
  assert.equal(mask('7911123456', phone('gb')), '+44 7911 123456');
  assert.equal(unmask('+48 512 345 678', phone('pl')), '48512345678');
});

test('шаблон в автомаске — под определённую страну', () => {
  const m = phoneAuto();
  assert.equal(m.template('+375', '_'), '+375 (__) ___-__-__');
  assert.equal(m.template('+7', '_'), '+7 (___) ___-__-__');
});
