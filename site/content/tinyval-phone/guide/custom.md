::: ru
Форматы стран и флаги можно поменять под себя — так же, как [тексты ошибок в tinyval](@/tinyval/guide/custom-lang): команда копирует данные пакета в ваш проект, вы правите файл и один раз подключаете его при старте приложения.
:::

::: en
Country formats and flags can be changed to suit you — the same way as [error messages in tinyval](@/tinyval/guide/custom-lang): a command copies the package data into your project, you edit the file and load it once on app startup.
:::

::: zh
国家格式和国旗都可以按需修改 —— 与 [tinyval 的错误提示](@/tinyval/guide/custom-lang) 的方式相同：一条命令把包中的数据复制到你的项目中，你修改文件，然后在应用启动时加载一次。
:::

::: ru
## Страны и форматы
:::

::: en
## Countries and formats
:::

::: zh
## 国家和格式
:::

```bash
npx tinyval-phone countries            # все 245 стран → phones/countries.ts
npx tinyval-phone countries ru kz de   # только эти страны, остальные остаются как в пакете
```

```ts
// phones/countries.ts
import type { Countries } from 'tinyval-phone';

export default {
  ru: ['7', '(999) 999-99-99', '[78]'],
  kz: ['7', '(999) 999-99-99', '[78]', '[67]'],
  de: ['49', '9999 9999999[9]', '0'],      // свой формат
  ab: ['7', '(999) 999-99-99', '[78]', '940'], // новая страна: +7 940…
  xk: null,                                // убрать страну
} satisfies Countries;
```

```ts
// main.ts — до создания масок
import { setCountries } from 'tinyval-phone';
import countries from './phones/countries';

setCountries(countries);
```

::: ru
Запись страны — `[код, шаблон после кода, национальная приставка, признак страны]`:

| Часть | Пример | Что значит |
| --- | --- | --- |
| код | `'49'` | Телефонный код без `+` |
| шаблон | `'999 9999999[9]'` | `9` — цифра, `[9]` — необязательная цифра, `'\\9'` в строке — цифра 9 как есть |
| приставка | `'0'`, `'[78]'` | Что набирают перед местным номером; отбрасывается: `07400…` → `+44 7400…` |
| признак | `'242'`, `'…$'` | Для стран с общим кодом: начало номера без кода страны или, с `$` на конце, весь номер |

Приставка и признак — регулярные выражения по цифрам номера без кода страны. Как различаются страны с общим кодом — в [Странах и форматах](~/guide/countries#страны-с-общим-кодом).

Только свои страны, без остального мира — `setCountries(countries, { replace: true })`: остальные номера не будут определяться и не будут `valid`.
:::

::: en
A country entry is `[dial code, pattern after the code, national prefix, country sign]`:

| Part | Example | Meaning |
| --- | --- | --- |
| dial code | `'49'` | The dial code without `+` |
| pattern | `'999 9999999[9]'` | `9` — a digit, `[9]` — an optional digit, `'\\9'` in a string — a literal nine |
| prefix | `'0'`, `'[78]'` | What's dialed before a local number; it's dropped: `07400…` → `+44 7400…` |
| sign | `'242'`, `'…$'` | For countries sharing a code: the beginning of the number without the country code or, ending with `$`, the whole number |

The prefix and the sign are regular expressions over the digits without the country code. How countries sharing a code are told apart — in [Countries & formats](~/guide/countries#countries-sharing-a-code).

Only your countries, without the rest of the world — `setCountries(countries, { replace: true })`: other numbers won't be detected and won't be `valid`.
:::

::: zh
国家条目为 `[区号, 区号后的模板, 国内长途前缀, 国家特征]`：

| 部分 | 示例 | 含义 |
| --- | --- | --- |
| 区号 | `'49'` | 不带 `+` 的电话区号 |
| 模板 | `'999 9999999[9]'` | `9` —— 数字，`[9]` —— 可选数字，字符串中的 `'\\9'` —— 字面数字 9 |
| 前缀 | `'0'`、`'[78]'` | 拨打本地号码前加的前缀；会被去掉：`07400…` → `+44 7400…` |
| 特征 | `'242'`、`'…$'` | 用于共用区号的国家：不含国家代码的号码开头，或以 `$` 结尾时表示整个号码 |

前缀和特征是针对不含国家代码的号码数字的正则表达式。如何区分共用区号的国家 —— 见 [国家与格式](~/guide/countries)。

只保留自己的国家，不包含世界其他国家 —— `setCountries(countries, { replace: true })`：其他号码将不会被识别，也不会是 `valid`。
:::

::: ru
## Флаги

Команда копирует SVG выбранных флагов в модуль — правьте разметку или замените её своей. Все флаги из этого файла попадают в бандл, поэтому оставляйте только те, что меняете:
:::

::: en
## Flags

The command copies the SVG of the chosen flags into a module — edit the markup or replace it with your own. All flags in this file get into the bundle, so keep only the ones you change:
:::

::: zh
## 国旗

该命令会把所选国旗的 SVG 复制到一个模块中 —— 你可以修改标记或替换为自己的。这个文件里的所有国旗都会进入打包文件，所以只保留你要修改的那些：
:::

```bash
npx tinyval-phone flags ru kz          # → phones/flags.ts
npx tinyval-phone flags --all --svg --out public/flags   # файлы .svg — для <img> или графического редактора
```

```ts
// phones/flags.ts
import type { Flags } from 'tinyval-phone/flags';

export default {
  ru: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">…</svg>',
  ab: () => import('./ab.svg?raw').then((m) => m.default), // загрузится, когда понадобится
  su: null,                                                // флага нет
} satisfies Flags;
```

```ts
import { setFlags } from 'tinyval-phone/flags';
import flags from './phones/flags';

setFlags(flags);
```

::: ru
### Свой набор флагов целиком

Функция вместо объекта загружает любой флаг. Вернула `undefined` — используется встроенный. Флаги, заданные по коду, важнее функции.
:::

::: en
### Your own flag set entirely

A function instead of an object loads any flag. If it returns `undefined`, the built-in flag is used. Flags set by code take priority over the function.
:::

::: zh
### 整套使用自己的国旗

用函数代替对象可以加载任意国旗。返回 `undefined` 时使用内置国旗。按代码设置的国旗优先于该函数。
:::

```ts
// например, круглые флаги с вашего CDN
setFlags((code) => fetch(`/flags/round/${code}.svg`).then((r) => (r.ok ? r.text() : undefined)));
```

::: ru
`resetFlags()` возвращает встроенные флаги, `flagCodes()` — список флагов с учётом ваших.
:::

::: en
`resetFlags()` brings back the built-in flags, `flagCodes()` lists the flags including yours.
:::

::: zh
`resetFlags()` 恢复内置国旗，`flagCodes()` 列出包括你自定义国旗在内的所有国旗。
:::

::: ru
## Без файла
:::

::: en
## Without a file
:::

::: zh
## 不使用文件
:::

::: ru
Пара изменений не стоит отдельного файла — `setCountries` и `setFlags` принимают объект прямо в коде:
:::

::: en
A couple of changes aren't worth a separate file — `setCountries` and `setFlags` take an object right in the code:
:::

::: zh
只有少量修改时不必单独建文件 —— `setCountries` 和 `setFlags` 可以直接在代码中传入对象：
:::

```ts
setCountries({ de: ['49', '9999 9999999[9]', '0'] });
setFlags({ ru: myRussianFlagSvg });
```
