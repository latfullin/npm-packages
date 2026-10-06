::: ru
Маски телефонов всех стран для [tinyval-mask](@/tinyval-mask/). В `tinyval-mask` — 28 самых нужных стран, здесь — 245: по коду, который вводит пользователь, определяется страна и её формат номера.

- Тот же API, что у `phone` / `phoneAuto` из `tinyval-mask/presets` — достаточно поменять импорт
- Форматы — из данных Google libphonenumber: в каждой стране номер выглядит так, как его пишут там
- Страны с общим кодом различаются: `+1 242` — Багамы, `+44 7797` — Джерси, `+7 701` — Казахстан
- Национальная приставка не мешает: `07400 123456` в Британии → `+44 7400 123456`
- Иконки флагов в SVG для всех стран — грузятся по одной, в бандл попадают только нужные
- ~4 kB gzip за все страны (без флагов)
:::

::: en
Phone masks for every country for [tinyval-mask](@/tinyval-mask/). `tinyval-mask` has the 28 most needed countries, this package has 245: the country and its number format are detected by the code the user types.

- The same API as `phone` / `phoneAuto` from `tinyval-mask/presets` — just change the import
- Formats come from Google libphonenumber data: in every country the number looks the way it's written there
- Countries sharing a code are told apart: `+1 242` is the Bahamas, `+44 7797` is Jersey, `+7 701` is Kazakhstan
- The national prefix doesn't get in the way: `07400 123456` in the UK → `+44 7400 123456`
- SVG flag icons for every country — loaded one by one, only the needed ones get into the bundle
- ~4 kB gzip for all countries (without flags)
:::

::: zh
适用于 [tinyval-mask](@/tinyval-mask/) 的全球电话掩码。`tinyval-mask` 包含最常用的 28 个国家，本包包含 245 个：根据用户输入的区号识别国家及其号码格式。

- 与 `tinyval-mask/presets` 中的 `phone` / `phoneAuto` API 相同 —— 只需更换导入
- 格式来自 Google libphonenumber 数据：每个国家的号码都按当地的写法显示
- 能区分共用区号的国家：`+1 242` 是巴哈马，`+44 7797` 是泽西岛，`+7 701` 是哈萨克斯坦
- 国内长途前缀不会造成干扰：英国的 `07400 123456` → `+44 7400 123456`
- 所有国家的 SVG 国旗图标 —— 按需逐个加载，只有用到的才会进入打包文件
- 全部国家约 4 kB gzip（不含国旗）
:::

::: ru
## Установка
:::

::: en
## Install
:::

::: zh
## 安装
:::

```bash
npm install tinyval-mask tinyval-phone
```

::: ru
## Попробовать
:::

::: en
## Try it
:::

::: zh
## 试一试
:::

<TinyvalPhoneDemo />

::: ru
## Быстрый старт
:::

::: en
## Quick start
:::

::: zh
## 快速开始
:::

```ts
import { mask, unmask } from 'tinyval-mask';
import { phoneAuto, phone, countryName } from 'tinyval-phone';
import { loadFlag } from 'tinyval-phone/flags';

const tel = phoneAuto({ defaultCountry: 'ru' });
mask('+81 9012345678', tel);       // '+81 90-1234-5678'
mask('89991234567', tel);          // '+7 (999) 123-45-67'
unmask('+81 90-1234-5678', tel);   // '819012345678'
tel.country('+1 242 359 1234');    // { code: 'bs', dial: '1', flag: '🇧🇸' }
countryName('bs', 'ru');           // 'Багамы'

mask('0612345678', phone('fr'));   // '+33 6 12 34 56 78'
await loadFlag('bs');              // '<svg …>' — иконка флага
```

::: ru
## Когда что брать

- Нужны Россия, СНГ и несколько крупных стран — хватит `tinyval-mask/presets`, отдельный пакет не нужен.
- Пользователи из любой страны мира или нужен список всех стран — `tinyval-phone`.
- Иконки флагов (эмодзи-флаги Windows не показывает) — `tinyval-phone/flags`, можно и вместе с масками из `tinyval-mask`.
:::

::: en
## What to use when

- You need Russia, the CIS and a few large countries — `tinyval-mask/presets` is enough, no extra package needed.
- Users from anywhere in the world, or you need a list of all countries — `tinyval-phone`.
- Flag icons (Windows doesn't show flag emoji) — `tinyval-phone/flags`, also together with masks from `tinyval-mask`.
:::

::: zh
## 如何选择

- 只需要俄罗斯、独联体和几个大国 —— `tinyval-mask/presets` 就够了，不需要额外的包。
- 用户来自世界各地，或需要所有国家的列表 —— 使用 `tinyval-phone`。
- 国旗图标（Windows 不显示国旗表情）—— 使用 `tinyval-phone/flags`，也可以与 `tinyval-mask` 的掩码一起使用。
:::

::: ru
## Что дальше

- [Страны и форматы](~/guide/countries) — откуда форматы, как различаются страны с общим кодом
- [Иконки флагов](~/guide/flags) — SVG в `<img>` или разметкой, в Vue и без фреймворка
- [phoneAuto](~/api/phone-auto) — все опции
- [Поле ввода](@/tinyval-mask/guide/browser) и [Vue](@/tinyval-mask/guide/vue) — как подключить маску к полю
:::

::: en
## What's next

- [Countries & formats](~/guide/countries) — where formats come from, how countries sharing a code are told apart
- [Flag icons](~/guide/flags) — SVG in `<img>` or as markup, in Vue and without a framework
- [phoneAuto](~/api/phone-auto) — all options
- [Input field](@/tinyval-mask/guide/browser) and [Vue](@/tinyval-mask/guide/vue) — how to bind a mask to a field
:::

::: zh
## 下一步

- [国家与格式](~/guide/countries) —— 格式从哪里来，如何区分共用区号的国家
- [国旗图标](~/guide/flags) —— 在 `<img>` 中使用 SVG 或直接插入标记，Vue 中和无框架时的用法
- [phoneAuto](~/api/phone-auto) —— 全部选项
- [输入框](@/tinyval-mask/guide/browser) 和 [Vue](@/tinyval-mask/guide/vue) —— 如何将掩码绑定到输入框
:::
