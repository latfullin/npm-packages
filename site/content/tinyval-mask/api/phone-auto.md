::: ru
Телефон любой страны: маска выбирается по коду, который вводит пользователь. `+375` — маска Беларуси, `+49` — Германии, `+7 701` — Казахстана. Вместе с маской — данные для интерфейса: флаг, название страны, телефонный код.
:::

::: en
A phone number of any country: the mask is chosen by the code the user types. `+375` — the Belarus mask, `+49` — Germany, `+7 701` — Kazakhstan. Along with the mask you get data for the UI: a flag, the country name, the dial code.
:::

::: zh
任意国家的电话号码：根据用户输入的区号选择掩码。`+375` —— 白俄罗斯的掩码，`+49` —— 德国，`+7 701` —— 哈萨克斯坦。同时提供用于界面的数据：国旗、国家名称、电话区号。
:::

## @t(signature)

```ts
function phoneAuto(options?: { defaultCountry?: PhoneCountry; countries?: PhoneCountry[] }): PhoneAutoMask

interface PhoneAutoMask extends Mask {
  country(value: string): CountryInfo | undefined;
}

interface CountryInfo {
  code: PhoneCountry; // 'by'
  dial: string;       // '375'
  flag: string;       // '🇧🇾'
}
```

## @t(params)

::: ru
| Опция | Описание |
| --- | --- |
| `defaultCountry` | Страна по умолчанию. Номер без `+` считается местным: `9991234567` → `+7 (999) 123-45-67`. Пустое поле показывает её шаблон и флаг. Без опции номер всегда вводится с кодом страны |
| `countries` | Среди каких стран определять. При общем коде побеждает первая: `['ca', 'us']` — `+1` будет Канадой |
:::

::: en
| Option | Description |
| --- | --- |
| `defaultCountry` | The default country. A number without `+` is local: `9991234567` → `+7 (999) 123-45-67`. An empty field shows its template and flag. Without the option the number is always typed with the country code |
| `countries` | Which countries to detect among. With a shared code the first one wins: `['ca', 'us']` — `+1` becomes Canada |
:::

::: zh
| 选项 | 说明 |
| --- | --- |
| `defaultCountry` | 默认国家。不带 `+` 的号码视为本地号码：`9991234567` → `+7 (999) 123-45-67`。空输入框显示该国家的模板和国旗。不设置时，号码始终需要带国家代码输入 |
| `countries` | 在哪些国家中识别。区号相同时第一个优先：`['ca', 'us']` —— `+1` 识别为加拿大 |
:::

## @t(notes)

::: ru
- Определение идёт по самому длинному подходящему коду: `+3` и `+37` — ещё не страна, `+375` — Беларусь. Пока страна не определена, принимается до 15 цифр (максимум международного стандарта E.164).
- `+7` — Россия, но `+7 6…` и `+7 7…` — Казахстан (коды казахстанских операторов).
- Чтобы ввести номер другой страны, когда поле уже показывает страну по умолчанию, достаточно набрать `+` — ввод начнётся заново.
- Значение без маски — все цифры с кодом страны: `375291234567`.
- `valid` и [`isValid`](~/api/mask) — `true`, только если номер заполнен по маске определённой страны.
- Национальная приставка отбрасывается: с `defaultCountry: 'gb'` номер `07400 123456` станет `+44 7400 123456`, с `'ru'` — `8 999…` станет `+7 (999)…`.
- Список стран — в [Готовых масках](~/api/presets#телефоны). Все 245 стран мира — пакет [tinyval-phone](@/tinyval-phone/) с тем же API.
:::

::: en
- Detection uses the longest matching code: `+3` and `+37` aren't a country yet, `+375` is Belarus. Until the country is known, up to 15 digits are accepted (the maximum of the international E.164 standard).
- `+7` is Russia, but `+7 6…` and `+7 7…` are Kazakhstan (Kazakh operator codes).
- To type a number of another country when the field already shows the default country, just type `+` — input starts over.
- The unmasked value is all digits including the country code: `375291234567`.
- `valid` and [`isValid`](~/api/mask) are `true` only if the number is filled by the mask of a detected country.
- The national prefix is dropped: with `defaultCountry: 'gb'` the number `07400 123456` becomes `+44 7400 123456`, with `'ru'` — `8 999…` becomes `+7 (999)…`.
- The country list is in [Ready-made masks](~/api/presets#phones). All 245 countries of the world — the [tinyval-phone](@/tinyval-phone/) package with the same API.
:::

::: zh
- 按最长匹配的区号识别：`+3` 和 `+37` 还不是国家，`+375` 是白俄罗斯。在识别出国家之前，最多接受 15 位数字（国际标准 E.164 的上限）。
- `+7` 是俄罗斯，但 `+7 6…` 和 `+7 7…` 是哈萨克斯坦（哈萨克斯坦运营商代码）。
- 当输入框已显示默认国家时，如需输入其他国家的号码，只需输入 `+` —— 输入会重新开始。
- 去掉掩码后为包含国家代码的全部数字：`375291234567`。
- 只有当号码按识别出的国家掩码填写完整时，`valid` 和 [`isValid`](~/api/mask) 才为 `true`。
- 国内长途前缀会被去掉：设置 `defaultCountry: 'gb'` 时，号码 `07400 123456` 会变成 `+44 7400 123456`；设置 `'ru'` 时，`8 999…` 会变成 `+7 (999)…`。
- 国家列表见 [预设掩码](~/api/presets)。全球全部 245 个国家 —— 使用 API 相同的 [tinyval-phone](@/tinyval-phone/) 包。
:::

## @t(examples)

::: ru
### Флаг и название страны рядом с полем
:::

::: en
### A flag and the country name next to the field
:::

::: zh
### 在输入框旁显示国旗和国家名称
:::

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { phoneAuto, countryName } from 'tinyval-mask/presets';
import { vMask } from 'tinyval-mask/vue';

const phoneMask = phoneAuto({ defaultCountry: 'ru' });
const tel = ref('');
const country = computed(() => phoneMask.country(tel.value));
</script>

<template>
  <label>
    <span v-if="country">{{ country.flag }} {{ countryName(country.code, 'ru') }}</span>
    <input v-model="tel" v-mask.raw="{ mask: phoneMask, placeholder: '_' }" inputmode="tel" />
  </label>
  <!-- tel: '375291234567' -->
</template>
```

::: ru
### Свой выбор страны
:::

::: en
### Your own country picker
:::

::: zh
### 自定义国家选择
:::

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { phone, phoneCountries, countryName, type PhoneCountry } from 'tinyval-mask/presets';

const countries = phoneCountries(); // [{ code: 'ru', dial: '7', flag: '🇷🇺' }, …]
const selected = ref<PhoneCountry>('ru');
const phoneMask = computed(() => phone(selected.value));
</script>

<template>
  <select v-model="selected">
    <option v-for="c in countries" :key="c.code" :value="c.code">
      {{ c.flag }} {{ countryName(c.code, 'ru') }} +{{ c.dial }}
    </option>
  </select>
  <input v-model="tel" v-mask.raw="phoneMask" />
</template>
```

::: ru
### Без интерфейса
:::

::: en
### Without UI
:::

::: zh
### 不涉及界面
:::

```ts
detectCountry('+375291234567'); // 'by'
detectCountry('77011234567');   // 'kz'
flag('de');                     // '🇩🇪'
countryName('de', 'ru');        // 'Германия'
unmask('+49 151 23456789', phoneAuto()); // '4915123456789'
```

::: ru
## Флаги и названия

- `flag(code)` — флаг-эмодзи из кода страны. Windows вместо флагов-эмодзи показывает две буквы (`RU`) — если это важно, берите SVG-иконки из [tinyval-phone/flags](@/tinyval-phone/guide/flags) по `country.code`.
- `countryName(code, locale)` — название на любом языке через стандартный `Intl.DisplayNames`: таблицы названий в пакете нет, поэтому размер не растёт.
:::

::: en
## Flags and names

- `flag(code)` — a flag emoji from the country code. Windows shows two letters (`RU`) instead of flag emoji — if that matters, use SVG icons from [tinyval-phone/flags](@/tinyval-phone/guide/flags) by `country.code`.
- `countryName(code, locale)` — the name in any language via the standard `Intl.DisplayNames`: there's no table of names in the package, so the size doesn't grow.
:::

::: zh
## 国旗和名称

- `flag(code)` —— 根据国家代码生成国旗表情。Windows 会显示两个字母（`RU`）而不是国旗表情 —— 如果这很重要，请按 `country.code` 使用 [tinyval-phone/flags](@/tinyval-phone/guide/flags) 中的 SVG 图标。
- `countryName(code, locale)` —— 通过标准的 `Intl.DisplayNames` 获取任意语言的名称：包中没有名称表，因此不会增加体积。
:::

::: ru
## Свои страны и форматы

`phoneTable` — таблица стран пакета. Функции `phoneFrom`, `phoneAutoFrom`, `detectCountryFrom`, `phoneCountriesFrom` работают так же, но с любой таблицей: можно добавить страну или поменять формат. Запись страны — `[код, шаблон после кода, национальная приставка, признак страны]`, приставка и признак — регулярные выражения по цифрам без кода страны.
:::

::: en
## Your own countries and formats

`phoneTable` is the package's country table. `phoneFrom`, `phoneAutoFrom`, `detectCountryFrom`, `phoneCountriesFrom` work the same way but with any table: add a country or change a format. A country entry is `[dial code, pattern after the code, national prefix, country sign]`; the prefix and the sign are regular expressions over the digits without the country code.
:::

::: zh
## 自定义国家和格式

`phoneTable` 是本包的国家表。`phoneFrom`、`phoneAutoFrom`、`detectCountryFrom`、`phoneCountriesFrom` 的用法相同，但适用于任何表：可以添加国家或修改格式。国家条目为 `[区号, 区号后的模板, 国内长途前缀, 国家特征]`，前缀和特征是针对不含国家代码的数字的正则表达式。
:::

```ts
import { phoneTable, phoneAutoFrom } from 'tinyval-mask/presets';

const table = {
  ...phoneTable,
  jp: ['81', '99-9999-9999', '0'],
  bs: ['1', '(999) 999-9999', '1', '242'], // +1 242… — Багамы / the Bahamas
} as const;
const tel = phoneAutoFrom(table, { defaultCountry: 'jp' });
mask('09012345678', tel); // '+81 90-1234-5678'
```

## @t(see)

::: ru
- [Готовые маски](~/api/presets) — `phone(country)` для одной страны
- [vMask](~/api/v-mask) — `.raw` и видимый шаблон
:::

::: en
- [Ready-made masks](~/api/presets) — `phone(country)` for a single country
- [vMask](~/api/v-mask) — `.raw` and the visible template
:::

::: zh
- [预设掩码](~/api/presets)：单个国家的 `phone(country)`
- [vMask](~/api/v-mask)：`.raw` 和可见模板
:::
