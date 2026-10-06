import { phone, phoneAuto, detectCountry, type PhoneCountry } from 'tinyval-phone';
import { loadFlag } from 'tinyval-phone/flags';
import { mask } from 'tinyval-mask';

const c: PhoneCountry = 'jp';
mask('123', phone(c));
const m = phoneAuto({ defaultCountry: 'br', countries: ['br', 'ar'] });
const code: PhoneCountry | undefined = m.country('+55')?.code;
const d: PhoneCountry | undefined = detectCountry('+81');
// страны, добавленные через setCountries, — тоже строки; подсказки — для стран пакета
phone('xx');
const svg: Promise<string | undefined> = loadFlag('ru');
void code, d, svg;

import { setCountries, type Countries } from 'tinyval-phone';
import { setFlags, type Flags } from 'tinyval-phone/flags';
const countries = { de: ['49', '9999 9999999[9]', '0'], xk: null } satisfies Countries;
setCountries(countries);
phone('ab'); // добавленная страна
const flags = { ru: '<svg/>', su: null, xx: () => import('tinyval-phone/flags').then(() => '<svg/>') } satisfies Flags;
setFlags(flags);
setFlags((code) => `<svg data-code="${code}"/>`);
