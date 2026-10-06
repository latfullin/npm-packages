import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addWorkdays, calendar, countWorkdays, day, holidays } from '../dist/calendar.js';

const ru = { country: 'RU' };

// КонсультантПлюс: рабочие дни / часы при 40-часовой неделе по месяцам
const consultant = {
  2024: [[17, 136], [20, 159], [20, 159], [21, 168], [20, 159], [19, 151], [23, 184], [22, 176], [21, 168], [23, 184], [21, 167], [21, 168]],
  2025: [[17, 136], [20, 160], [21, 167], [22, 175], [18, 144], [19, 151], [23, 184], [21, 168], [22, 176], [23, 184], [19, 151], [22, 176]],
  2026: [[15, 120], [19, 152], [21, 168], [22, 175], [19, 151], [21, 167], [23, 184], [21, 168], [22, 176], [22, 176], [20, 159], [22, 176]],
  2027: [[15, 120], [19, 151], [22, 176], [22, 175], [19, 152], [21, 167], [22, 176], [22, 176], [22, 176], [21, 168], [20, 159], [22, 176]],
};
const totals = { 2024: [248, 1979, 1780.6], 2025: [247, 1972, 1774.4], 2026: [247, 1972, 1774.4], 2027: [247, 1972, 1774.4] };

for (const [year, months] of Object.entries(consultant)) {
  test(`РФ ${year}: производственный календарь совпадает с официальным`, () => {
    const c = calendar(ru, +year);
    assert.equal(c.estimated, false);
    assert.match(c.source, /^Постановление/);
    assert.deepEqual(c.months.map((m) => [m.workdays, m.hours[40]]), months);
    assert.deepEqual([c.total.workdays, c.total.hours[40], c.total.hours[36]], totals[year]);
  });
}

test('РФ: виды дней', () => {
  assert.deepEqual(day(ru, '2025-11-01'), { date: '2025-11-01', workday: true, kind: 'working-weekend', short: true });
  assert.deepEqual(day(ru, '2026-01-09'), { date: '2026-01-09', workday: false, kind: 'transfer' });
  assert.equal(day(ru, '2026-03-08').kind, 'holiday');
  assert.equal(day(ru, '2026-03-09').kind, 'transfer');
  assert.deepEqual(day(ru, '2026-04-30'), { date: '2026-04-30', workday: true, kind: 'workday', short: true });
  assert.deepEqual(day(ru, '2026-10-10'), { date: '2026-10-10', workday: false, kind: 'weekend' });
});

test('РФ: год без постановления — по ст. 112 ТК РФ', () => {
  const c = calendar(ru, 2028);
  assert.equal(c.estimated, true);
  // 4 ноября 2028 — суббота → понедельник 6 ноября
  assert.deepEqual(c.off.filter((d) => d.kind === 'transfer').map((d) => d.date), ['2028-11-06']);
  assert.ok(c.short.every((d) => d.startsWith('2028-')));
});

test('РФ: праздники — только нерабочие по ТК, без переносов date-holidays', () => {
  const list = holidays(ru, 2026, ['public', 'observance']);
  assert.equal(list.filter((h) => h.type === 'public').length, 14);
  assert.ok(!list.some((h) => h.date === '2026-03-09'));
  assert.equal(holidays({ country: 'RU', lang: 'en' }, 2026)[0].name, "New Year's Day");
});

test('другие страны: выходные и праздники', () => {
  assert.deepEqual(calendar({ country: 'SA' }, 2026).weekend, ['friday', 'saturday']);
  assert.equal(day({ country: 'US' }, '2026-07-03').kind, 'holiday'); // 4 июля — суббота, перенос на пятницу
  assert.equal(day({ country: 'DE', region: 'BY' }, '2026-01-06').kind, 'holiday');
  assert.equal(day({ country: 'DE', region: 'BE' }, '2026-01-06').kind, 'workday');
});

test('подсчёт и сдвиг рабочих дней', () => {
  assert.equal(countWorkdays(ru, '2026-01-01', '2026-01-31'), 15);
  assert.equal(addWorkdays(ru, '2026-04-30', 3), '2026-05-06');
  assert.equal(addWorkdays(ru, '2026-05-06', -3), '2026-04-30');
  assert.equal(addWorkdays(ru, '2026-01-01', 0), '2026-01-12');
});
