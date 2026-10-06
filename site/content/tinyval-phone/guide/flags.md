::: ru
## Зачем иконки

`flag(code)` из `tinyval-mask` даёт флаг-эмодзи — это ноль байт, но Windows вместо флагов-эмодзи показывает две буквы (`RU`). Иконки в SVG выглядят одинаково везде. В пакете — флаги 257 стран и территорий в пропорции 3:2 (из [country-flag-icons](https://gitlab.com/catamphetamine/country-flag-icons), MIT).

Флаги не обязательно брать вместе с масками `tinyval-phone` — они подходят и к `tinyval-mask`: код страны тот же (`country.code`).
:::

::: en
## Why icons

`flag(code)` from `tinyval-mask` gives a flag emoji — that's zero bytes, but Windows shows two letters (`RU`) instead of flag emoji. SVG icons look the same everywhere. The package contains flags of 257 countries and territories in 3:2 proportion (from [country-flag-icons](https://gitlab.com/catamphetamine/country-flag-icons), MIT).

You don't have to use the flags together with `tinyval-phone` masks — they work with `tinyval-mask` too: the country code is the same (`country.code`).
:::

::: zh
## 为什么需要图标

`tinyval-mask` 中的 `flag(code)` 提供国旗表情 —— 不占任何体积，但 Windows 会显示两个字母（`RU`）而不是国旗表情。SVG 图标在任何地方看起来都一样。本包包含 257 个国家和地区的国旗，比例为 3:2（来自 [country-flag-icons](https://gitlab.com/catamphetamine/country-flag-icons)，MIT 许可）。

国旗不一定要和 `tinyval-phone` 的掩码一起使用 —— 它们同样适用于 `tinyval-mask`：国家代码相同（`country.code`）。
:::

::: ru
## Разметкой: loadFlag

`loadFlag(code)` возвращает SVG-разметку. Каждый флаг — отдельный модуль: сборщик (Vite, webpack, esbuild) выносит их в отдельные файлы, и браузер загружает только показанные флаги.
:::

::: en
## As markup: loadFlag

`loadFlag(code)` returns SVG markup. Each flag is a separate module: the bundler (Vite, webpack, esbuild) puts them into separate files, and the browser loads only the flags that are shown.
:::

::: zh
## 作为标记：loadFlag

`loadFlag(code)` 返回 SVG 标记。每个国旗都是独立的模块：打包工具（Vite、webpack、esbuild）会把它们拆分成单独的文件，浏览器只加载显示出来的国旗。
:::

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { phoneAuto } from 'tinyval-phone';
import { loadFlag } from 'tinyval-phone/flags';
import { vMask } from 'tinyval-mask/vue';

const phoneMask = phoneAuto({ defaultCountry: 'ru' });
const tel = ref('');
const code = computed(() => phoneMask.country(tel.value)?.code);
const svg = ref<string>();
watch(code, async (c) => (svg.value = c ? await loadFlag(c) : undefined), { immediate: true });
</script>

<template>
  <span class="flag" v-html="svg" />
  <input v-model="tel" v-mask.raw="phoneMask" inputmode="tel" />
</template>

<style scoped>
.flag { display: inline-flex; width: 24px; height: 16px; }
.flag :deep(svg) { width: 100%; height: 100%; }
</style>
```

::: ru
## Файлом: `<img>`

Сами SVG лежат в пакете: `tinyval-phone/flags/<код>.svg`. Сборщик превратит импорт в адрес файла:
:::

::: en
## As a file: `<img>`

The SVG files themselves are in the package: `tinyval-phone/flags/<code>.svg`. The bundler turns an import into a file URL:
:::

::: zh
## 作为文件：`<img>`

SVG 文件本身就在包中：`tinyval-phone/flags/<代码>.svg`。打包工具会把导入转换为文件地址：
:::

```ts
import ru from 'tinyval-phone/flags/ru.svg'; // '/assets/ru-3f2a1c.svg'
```

```html
<img src="/node_modules/tinyval-phone/flags/ru.svg" width="24" height="16" alt="" />
```

::: ru
## Список всех флагов

`flagCodes()` — коды стран, для которых есть флаг: удобно для своего выпадающего списка. Кроме стран с телефонными кодами там есть, например, Антарктида (`aq`) и Европейский союз (`eu`).
:::

::: en
## List of all flags

`flagCodes()` — the codes of countries that have a flag: handy for your own dropdown. Besides countries with dial codes it includes, for example, Antarctica (`aq`) and the European Union (`eu`).
:::

::: zh
## 所有国旗的列表

`flagCodes()` —— 有国旗的国家代码：便于制作自己的下拉列表。除了有电话区号的国家，还包括例如南极洲（`aq`）和欧盟（`eu`）。
:::

```ts
import { flagCodes } from 'tinyval-phone/flags';

flagCodes().length;         // 257
flagCodes().includes('eu'); // true
```

::: ru
## Свои флаги

Заменить отдельные флаги или весь набор — `setFlags`, файл для правки создаёт `npx tinyval-phone flags ru kz`. Подробно — [Свои страны и флаги](~/guide/custom#флаги).
:::

::: en
## Your own flags

To replace some flags or the whole set — `setFlags`; `npx tinyval-phone flags ru kz` creates a file to edit. Details — [Your own countries & flags](~/guide/custom#flags).
:::

::: zh
## 自定义国旗

替换部分国旗或整套国旗 —— 使用 `setFlags`；`npx tinyval-phone flags ru kz` 会创建一个可编辑的文件。详见 [自定义国家和国旗](~/guide/custom)。
:::
