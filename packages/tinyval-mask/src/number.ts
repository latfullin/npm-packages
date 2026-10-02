// Числовая маска: 1 234 567,89 ₽
import type { Mask, MaskResult } from './core.js';

export interface NumberMaskOptions {
  // Разделитель тысяч, по умолчанию пробел
  thousands?: string;
  // Разделитель дробной части, по умолчанию запятая. Точка с клавиатуры тоже принимается
  decimal?: string;
  // Знаков после запятой, 0 — только целые
  precision?: number;
  // Разрешить минус
  negative?: boolean;
  prefix?: string;
  suffix?: string;
}

export function numberMask(options: NumberMaskOptions = {}): Mask {
  const { thousands = ' ', decimal = ',', precision = 2, negative = false, prefix = '', suffix = '' } = options;
  const decimals = [decimal, '.'].filter((c) => c !== thousands);
  return {
    process(input): MaskResult {
      let neg = false;
      let int = '';
      let frac = '';
      let dec = false;
      for (const ch of String(input ?? '')) {
        if (ch >= '0' && ch <= '9') {
          if (!dec) int += ch;
          else if (frac.length < precision) frac += ch;
        } else if (negative && ch === '-' && !int && !dec) neg = true;
        else if (precision > 0 && !dec && decimals.includes(ch)) dec = true;
      }
      int = int.replace(/^0+(?=\d)/, '');
      if (dec && !int) int = '0';
      const empty = !int && !neg;
      const slots: number[] = [];
      let value = empty ? '' : prefix;
      if (neg) {
        slots.push(value.length);
        value += '-';
      }
      for (const ch of int.replace(/\B(?=(\d{3})+(?!\d))/g, '\u0000')) {
        if (ch === '\u0000') value += thousands;
        else {
          slots.push(value.length);
          value += ch;
        }
      }
      if (dec) {
        slots.push(value.length);
        value += decimal;
        for (const ch of frac) {
          slots.push(value.length);
          value += ch;
        }
      }
      if (int) value += suffix;
      return {
        value,
        raw: (neg ? '-' : '') + int + (dec ? `.${frac}` : ''),
        complete: !!int,
        slots,
        overflow: false,
      };
    },
    output: (r) => r.raw,
  };
}
