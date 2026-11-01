::: ru
SVG-иконка флага по коду страны. Модуль `tinyval-phone/flags`.
:::

::: en
An SVG flag icon by country code. Module `tinyval-phone/flags`.
:::

::: zh
根据国家代码获取 SVG 国旗图标。模块 `tinyval-phone/flags`。
:::

## @t(signature)

```ts
function loadFlag(code: string): Promise<string | undefined>
function flagCodes(): string[]
function setFlags(flags: Record<string, FlagSource> | ((code: string) => string | undefined | Promise<string | undefined>)): void
function resetFlags(): void

type FlagSource = string | (() => string | undefined | Promise<string | undefined>) | null
```

## @t(notes)

::: ru
- Возвращает SVG-разметку (`'<svg …>'`); для неизвестного кода — `undefined`. Регистр кода не важен: `'RU'` и `'ru'`.
- Каждый флаг — отдельный модуль, поэтому функция асинхронная: флаг загружается при первом обращении. Сам загрузчик — ~3 kB gzip, флаг — от 150 байт до 1 kB.
- Флаги в пропорции 3:2, `viewBox="0 0 513 342"`. Размер задаётся CSS.
- Нужен файл, а не разметка — `tinyval-phone/flags/<код>.svg`, см. [Иконки флагов](~/guide/flags).
- `setFlags` заменяет флаги: объект по кодам (`null` — флага нет) или функция для всех. Флаг по коду важнее функции; функция вернула `undefined` — встроенный флаг. См. [Свои страны и флаги](~/guide/custom#флаги).
:::

::: en
- Returns SVG markup (`'<svg …>'`); `undefined` for an unknown code. The case doesn't matter: `'RU'` and `'ru'`.
- Each flag is a separate module, so the function is async: a flag is loaded on first use. The loader itself is ~3 kB gzip, a flag is 150 bytes to 1 kB.
- Flags are 3:2, `viewBox="0 0 513 342"`. The size is set with CSS.
- Need a file, not markup — `tinyval-phone/flags/<code>.svg`, see [Flag icons](~/guide/flags).
- `setFlags` replaces flags: an object by code (`null` — no flag) or a function for all. A flag by code wins over the function; if the function returns `undefined` — the built-in flag. See [Your own countries & flags](~/guide/custom#flags).
:::

::: zh
- 返回 SVG 标记（`'<svg …>'`）；未知代码返回 `undefined`。代码不区分大小写：`'RU'` 和 `'ru'` 都可以。
- 每个国旗都是独立的模块，因此该函数是异步的：国旗在首次使用时加载。加载器本身约 3 kB gzip，单个国旗 150 字节到 1 kB。
- 国旗比例为 3:2，`viewBox="0 0 513 342"`。尺寸通过 CSS 设置。
- 如果需要文件而不是标记 —— 使用 `tinyval-phone/flags/<代码>.svg`，见 [国旗图标](~/guide/flags)。
- `setFlags` 用于替换国旗：按代码的对象（`null` —— 无国旗）或适用于全部的函数。按代码设置的国旗优先于函数；函数返回 `undefined` 时使用内置国旗。见 [自定义国家和国旗](~/guide/custom)。
:::

## @t(examples)

```ts
import { loadFlag, flagCodes } from 'tinyval-phone/flags';

const el = document.querySelector('.flag')!;
el.innerHTML = (await loadFlag('jp')) ?? '';

await loadFlag('zz');  // undefined
flagCodes().length;    // 257
```

## @t(see)

::: ru
- [Иконки флагов](~/guide/flags) — в Vue, файлом в `<img>`
- [phoneAuto](~/api/phone-auto) — `country(value).code` для флага
:::

::: en
- [Flag icons](~/guide/flags) — in Vue, as a file in `<img>`
- [phoneAuto](~/api/phone-auto) — `country(value).code` for the flag
:::

::: zh
- [国旗图标](~/guide/flags) —— 在 Vue 中使用，或作为文件用于 `<img>`
- [phoneAuto](~/api/phone-auto) —— 用 `country(value).code` 获取国旗
:::
