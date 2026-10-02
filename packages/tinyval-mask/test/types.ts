// Проверка типов: файл только компилируется
import { createMask, mask, masks, numberMask, type Mask, type CardBrand } from '../dist/index.js';
import { vMask } from '../dist/vue.js';
import type { Directive } from 'vue';

const m: Mask = masks.phone('by');
const s: string = mask('1', m);
const b: CardBrand = masks.cardBrand('4');
const d: Directive = vMask;
createMask({ pattern: 'HH', tokens: { H: { pattern: /[0-9a-f]/i, transform: 'upper' } } });
numberMask({ precision: 0, suffix: ' %' });
// @ts-expect-error — такой страны нет
masks.phone('xx');
void s;
void b;
void d;
import { phone as phonePreset } from '../dist/presets.js';
const pp: Mask = phonePreset('ru');
void pp;
