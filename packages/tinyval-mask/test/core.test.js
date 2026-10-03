import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMask, mask, unmask, isComplete, numberMask, masks } from '../dist/index.js';

test('шаблон: цифры, литералы, ленивый хвост', () => {
  const m = createMask('(999) 999-99');
  assert.equal(mask('', m), '');
  assert.equal(mask('1', m), '(1');
  assert.equal(mask('123', m), '(123', 'литерал после последнего символа не добавляется');
  assert.equal(mask('1234', m), '(123) 4');
  assert.equal(mask('12345678', m), '(123) 456-78');
  assert.equal(mask('1234567890', m), '(123) 456-78', 'лишнее отбрасывается');
  assert.equal(mask('(123) 456-78', m), '(123) 456-78', 'повторное форматирование не меняет значение');
  assert.equal(mask('a1b2c3', m), '(123', 'неподходящие символы пропускаются');
  assert.equal(unmask('(123) 456-78', m), '12345678');
});

test('токены a и *, экранирование, свои токены', () => {
  assert.equal(mask('ab12', 'aa-99'), 'ab-12');
  assert.equal(mask('1a2b', '**-**'), '1a-2b');
  assert.equal(mask('12', '\\9-99'), '9-12');
  const hex = createMask({ pattern: 'HH-HH', tokens: { H: { pattern: /[0-9a-f]/i, transform: 'upper' } } });
  assert.equal(mask('a1zf9', hex), 'A1-F9');
  const lower = createMask({ pattern: 'LLL', tokens: { L: { pattern: /[a-z]/i, transform: 'lower' } } });
  assert.equal(mask('ABC', lower), 'abc');
});

test('необязательная часть заполняется целиком или не заполняется', () => {
  const m = createMask('99:99[:99]');
  assert.equal(mask('1230', m), '12:30');
  assert.equal(isComplete('1230', m), true);
  assert.equal(isComplete('12304', m), false);
  assert.equal(isComplete('123045', m), true);
  assert.equal(isComplete('123', m), false);
});

test('несколько шаблонов: первый, в который помещается ввод', () => {
  const m = createMask(['999-999', '9999-9999']);
  assert.equal(mask('123456', m), '123-456');
  assert.equal(mask('1234567', m), '1234-567');
  assert.equal(mask('12345678', m), '1234-5678');
});

test('шаблон-функция', () => {
  const m = createMask({ pattern: (s) => (s.replace(/\D/g, '').length > 4 ? '99 99 99' : '99-99') });
  assert.equal(mask('1234', m), '12-34');
  assert.equal(mask('12345', m), '12 34 5');
});

test('телефон РФ: 8 и 7 в начале, вставка в любом формате', () => {
  const p = masks.phone();
  for (const v of ['89991234567', '79991234567', '+79991234567', '9991234567', '8 (999) 123-45-67', '+7 999 123 45 67']) {
    assert.equal(mask(v, p), '+7 (999) 123-45-67', v);
    assert.equal(unmask(v, p), '79991234567', v);
  }
  assert.equal(mask('8', p), '+7');
  assert.equal(unmask('+7 (', p), '', 'один префикс — пустое значение');
  assert.equal(unmask('8', p), '');
  assert.equal(mask('+7 (8', p), '+7 (8', 'с + восьмёрка — уже код города');
  assert.equal(isComplete('+7 (999) 123-45-6', p), false);
  assert.equal(isComplete('+7 (999) 123-45-67', p), true);
});

test('телефоны других стран', () => {
  assert.equal(mask('291234567', masks.phone('by')), '+375 (29) 123-45-67');
  assert.equal(mask('331234567', masks.phone('by')), '+375 (33) 123-45-67', 'тройка оператора — не код страны');
  assert.equal(mask('375331234567', masks.phone('by')), '+375 (33) 123-45-67');
  assert.equal(unmask('291234567', masks.phone('by')), '375291234567');
  assert.equal(mask('671234567', masks.phone('ua')), '+380 (67) 123-45-67');
  assert.equal(mask('901234567', masks.phone('uz')), '+998 (90) 123-45-67');
  assert.equal(mask('2025550123', masks.phone('us')), '+1 (202) 555-0123');
  assert.equal(mask('87011234567', masks.phone('kz')), '+7 (701) 123-45-67');
  assert.equal(mask('998901234567', masks.phone('uz')), '+998 (90) 123-45-67', 'вставка с кодом страны');
  assert.equal(mask('+998901234567', masks.phone('uz')), '+998 (90) 123-45-67');
  assert.equal(mask('9', masks.phone('uz')), '+998 (9', 'первая 9 — номер, а не код страны');
  assert.equal(mask('12025550123', masks.phone('us')), '+1 (202) 555-0123');
});

test('карты: формат по платёжной системе', () => {
  const c = masks.card();
  assert.equal(mask('4276123456789012', c), '4276 1234 5678 9012');
  assert.equal(mask('378282246310005', c), '3782 822463 10005');
  assert.equal(mask('6200123456789012345', c), '6200 1234 5678 9012 345');
  assert.equal(unmask('4276 1234 5678 9012', c), '4276123456789012');
  assert.equal(masks.cardBrand('4276'), 'visa');
  assert.equal(masks.cardBrand('5500'), 'mastercard');
  assert.equal(masks.cardBrand('2221'), 'mastercard');
  assert.equal(masks.cardBrand('2200 7000'), 'mir');
  assert.equal(masks.cardBrand('3782'), 'amex');
  assert.equal(masks.cardBrand('6212'), 'unionpay');
  assert.equal(masks.cardBrand('9999'), 'unknown');
  assert.equal(mask('1226', masks.cardExpiry()), '12/26');
  assert.equal(isComplete('123', masks.cvc()), true);
  assert.equal(isComplete('12', masks.cvc()), false);
});

test('даты, время, документы', () => {
  assert.equal(mask('02102026', masks.date()), '02.10.2026');
  assert.equal(mask('20261002', masks.date('yyyy-mm-dd')), '2026-10-02');
  assert.equal(mask('10022026', masks.date('mm/dd/yyyy')), '10/02/2026');
  assert.equal(mask('0930', masks.time()), '09:30');
  assert.equal(mask('093015', masks.time(true)), '09:30:15');
  assert.equal(mask('021020261530', masks.datetime()), '02.10.2026 15:30');
  assert.equal(mask('12345678901', masks.snils()), '123-456-789 01');
  assert.equal(mask('4510123456', masks.passport()), '45 10 123456');
  assert.equal(isComplete('1234567890', masks.inn()), true);
  assert.equal(isComplete('12345678901', masks.inn()), false);
  assert.equal(isComplete('123456789012', masks.inn()), true);
  assert.equal(mask('7743ab001', masks.kpp()), '7743AB001');
  assert.equal(mask('40702810900000000001', masks.account()), '40702 810 9 0000 0000001');
  assert.equal(mask('a123bc777', masks.carPlate()), 'А 123 ВС 777', 'латиница → кириллица');
  assert.equal(mask('а123вс77', masks.carPlate()), 'А 123 ВС 77');
  assert.equal(mask('d123', masks.carPlate()), '', 'буквы не из списка не принимаются');
  assert.equal(mask('aabbccddeeff', masks.mac()), 'AA:BB:CC:DD:EE:FF');
  assert.equal(mask('ff8800', masks.hexColor()), '#FF8800');
});

test('numberMask: разделители, дробная часть, ноль, минус', () => {
  const n = numberMask();
  assert.equal(mask('1234567.891', n), '1 234 567,89');
  assert.equal(unmask('1 234 567,89', n), '1234567.89');
  assert.equal(mask('0,5', n), '0,5');
  assert.equal(mask(',', n), '0,');
  assert.equal(mask('00012', n), '12');
  assert.equal(mask('-5', n), '5', 'минус выключен по умолчанию');
  assert.equal(mask('-5', numberMask({ negative: true })), '-5');
  assert.equal(mask('1234.5', numberMask({ precision: 0 })), '12 345', 'без дробной части точка игнорируется');
  const en = numberMask({ thousands: ',', decimal: '.' });
  assert.equal(mask('1234567.5', en), '1,234,567.5');
  assert.equal(mask('1,234', en), '1,234', 'запятая — разделитель тысяч, а не дробной части');
  assert.equal(isComplete('', n), false);
});

test('деньги и проценты', () => {
  assert.equal(mask('1500', masks.money({ currency: '₽' })), '1 500 ₽');
  assert.equal(mask('1500,5', masks.money({ currency: '₽' })), '1 500,5 ₽');
  assert.equal(unmask('1 500,50 ₽', masks.money({ currency: '₽' })), '1500.50');
  assert.equal(mask('15', masks.percent()), '15 %');
  assert.equal(mask('', masks.percent()), '');
  assert.equal(mask('99', numberMask({ prefix: '$', thousands: ',', decimal: '.' })), '$99');
});

test('null и undefined не ломают функции', () => {
  assert.equal(mask(undefined, masks.phone()), '');
  assert.equal(unmask(null, masks.card()), '');
  assert.equal(mask(undefined, numberMask()), '');
});

test('даты и время: невозможные цифры не вводятся', () => {
  const d = masks.date();
  assert.equal(mask('3205', d), '30', '32-го числа нет: 2 пропущена');
  assert.equal(mask('3112', d), '31.12');
  assert.equal(mask('0000', d), '0', '00 число не вводится');
  assert.equal(mask('01132026', d), '01.12.026', '13-го месяца нет');
  assert.equal(mask('2902', d), '29.02', 'существование даты проверяет валидация');
  assert.equal(mask('2026-13-40', masks.date('yyyy-mm-dd')), '2026-10', '3 и 4 после 1 в месяце невозможны и пропускаются');
  assert.equal(mask('2359', masks.time()), '23:59');
  assert.equal(mask('2460', masks.time()), '20', '24 и 60 не вводятся');
  assert.equal(mask('235960', masks.time(true)), '23:59:0');
  assert.equal(mask('1326', masks.cardExpiry()), '12/6');
  assert.equal(mask('311220262359', masks.datetime()), '31.12.2026 23:59');
});

test('allow в своей маске', () => {
  const even = createMask({ pattern: '9999', allow: (_, ch) => Number(ch) % 2 === 0 });
  assert.equal(mask('123456', even), '246');
});

test('template: шаблон с заполнителем', () => {
  assert.equal(masks.phone().template('', '_'), '+7 (___) ___-__-__');
  assert.equal(masks.card().template('3782', '_'), '____ ______ _____', 'шаблон Amex');
  assert.equal(masks.card().template('4276', '_'), '____ ____ ____ ____');
  assert.equal(masks.inn().template('', '•'), '••••••••••', 'необязательная часть не показывается');
  assert.equal(numberMask().template, undefined, 'у числовой маски шаблона нет');
});

test('valid: значение правильно по смыслу', async () => {
  const { isValid, isComplete } = await import('../dist/index.js');
  const cases = [
    [masks.date(), '31.02.2026', true, false],
    [masks.date(), '29.02.2024', true, true],
    [masks.date(), '29.02.2026', true, false],
    [masks.date('yyyy-mm-dd'), '2026-04-31', true, false],
    [masks.datetime(), '30.04.2026 23:59', true, true],
    [masks.card(), '4111 1111 1111 1111', true, true],
    [masks.card(), '4111 1111 1111 1112', true, false],
    [masks.card(), '3782 822463 10005', true, true],
    [masks.cardExpiry(), '12/99', true, true],
    [masks.cardExpiry(), '01/20', true, false],
    [masks.inn(), '7707083893', true, true],
    [masks.inn(), '7707083894', true, false],
    [masks.inn(), '500100732259', true, true],
    [masks.snils(), '112-233-445 95', true, true],
    [masks.snils(), '112-233-445 96', true, false],
    [masks.ogrn(), '1027700132195', true, true],
    [masks.ogrn(), '1027700132196', true, false],
    [masks.ogrn(), '304500116000157', true, true],
    [masks.phone(), '+7 (999) 123-45-67', true, true],
    [masks.phone(), '+7 (999) 123', false, false],
    [masks.phoneAuto(), '+375291234567', true, true],
    [masks.phoneAuto(), '+999123456789012', true, false],
    [numberMask(), '12', true, true],
    [createMask('99-99'), '12-34', true, true],
  ];
  for (const [m, v, complete, valid] of cases) {
    assert.equal(isComplete(v, m), complete, `complete ${v}`);
    assert.equal(isValid(v, m), valid, `valid ${v}`);
    assert.equal(m.process(v).valid, valid);
  }
});

test('validate в своей маске вызывается только для заполненного значения', () => {
  let calls = 0;
  const m = createMask({ pattern: '9999', validate: ({ raw }) => (calls++, raw !== '0000') });
  assert.equal(m.process('12').valid, false);
  assert.equal(calls, 0);
  assert.equal(m.process('0000').valid, false);
  assert.equal(m.process('1234').valid, true);
  assert.equal(calls, 2);
});
