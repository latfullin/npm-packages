::: ru
Директива `v-mask` из `tinyval-mask/vue` вешает маску на поле. Сам Vue пакету не нужен: директива — обычный объект, Vue используется только для типов.
:::

::: en
The `v-mask` directive from `tinyval-mask/vue` puts a mask on a field. The package doesn't need Vue at runtime: the directive is a plain object, Vue is used only for types.
:::

::: zh
来自 `tinyval-mask/vue` 的 `v-mask` 指令可以把掩码绑定到字段上。该包运行时不依赖 Vue：指令只是一个普通对象，Vue 仅用于类型。
:::

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { phone, money } from 'tinyval-mask/presets';
import { vMask } from 'tinyval-mask/vue';

// create masks once, not inline in the template
const phoneMask = phone();
const moneyMask = money({ currency: '₽' });

const tel = ref('');
const amount = ref('');
</script>

<template>
  <input v-model="tel" v-mask="phoneMask" />
  <input v-model="amount" v-mask="moneyMask" inputmode="decimal" />
  <input v-mask="'99.99.9999'" />
</template>
```

::: ru
- В `v-model` попадает значение **с маской**: `+7 (999) 123-45-67`. Чтобы получить значение без маски, добавьте модификатор `.raw` — см. ниже.
- Маску создавайте в `<script>`: выражение вроде `v-mask="phone()"` создаёт новую маску при каждой перерисовке.
- Директиву можно повесить на обёртку — она найдёт `<input>` внутри. Так маска работает с полями UI-библиотек.
- Для глобальной регистрации: `app.directive('mask', vMask)`.
:::

::: en
- `v-model` gets the **masked** value: `+7 (999) 123-45-67`. To get the unmasked value add the `.raw` modifier — see below.
- Create masks in `<script>`: an expression like `v-mask="phone()"` creates a new mask on every render.
- The directive can go on a wrapper — it finds the `<input>` inside. That's how masks work with UI library fields.
- Global registration: `app.directive('mask', vMask)`.
:::

::: zh
- `v-model` 得到的是**带掩码**的值：`+7 (999) 123-45-67`。如需去掉掩码的值，请添加 `.raw` 修饰符 —— 见下文。
- 请在 `<script>` 中创建掩码：像 `v-mask="phone()"` 这样的表达式会在每次渲染时创建新的掩码。
- 指令可以放在包裹元素上 —— 它会找到内部的 `<input>`。这样掩码就能用于 UI 组件库的字段。
- 全局注册：`app.directive('mask', vMask)`。
:::

::: ru
## Значение без маски — .raw

С модификатором `.raw` в поле видна маска, а в `v-model` попадает значение без неё — то же, что вернул бы [`unmask`](~/api/mask). Его можно сразу сохранять:
:::

::: en
## Unmasked value — .raw

With the `.raw` modifier the field shows the mask while `v-model` gets the value without it — the same as [`unmask`](~/api/mask) returns. It can be saved right away:
:::

::: zh
## 去掉掩码的值 —— .raw

使用 `.raw` 修饰符时，输入框显示掩码，而 `v-model` 得到的是去掉掩码的值 —— 与 [`unmask`](~/api/mask) 的返回值相同。可以直接保存：
:::

```vue
<input v-model="tel" v-mask.raw="phoneMask" />    <!-- tel: '79991234567' -->
<input v-model="amount" v-mask.raw="moneyMask" /> <!-- amount: '1500.5' -->
```

::: ru
Значение из модели показывается с маской: `tel = '79991234567'` → в поле `+7 (999) 123-45-67`. Курсор при правке в середине не прыгает, даже когда Vue перерисовывает поле.

## Видимый шаблон

Передайте символ-заполнитель — при фокусе в поле появится весь шаблон, курсор встанет на первую пустую позицию:
:::

::: en
A value from the model is shown with the mask: `tel = '79991234567'` → the field shows `+7 (999) 123-45-67`. The caret doesn't jump when editing in the middle, even when Vue re-renders the field.

## Visible template

Pass a placeholder character — on focus the field shows the whole template and the caret goes to the first empty position:
:::

::: zh
模型中的值会带掩码显示：`tel = '79991234567'` → 输入框显示 `+7 (999) 123-45-67`。即使 Vue 重新渲染输入框，在中间编辑时光标也不会跳动。

## 可见模板

传入占位字符 —— 获得焦点时输入框会显示完整模板，光标位于第一个空位：
:::

```vue
<input v-model="tel" v-mask.raw="{ mask: phoneMask, placeholder: '_' }" placeholder="Phone" />
<!-- on focus: +7 (___) ___-__-__   typing: +7 (999) 12_-__-__ -->
```

::: ru
- В `v-model` шаблон не попадает: без `.raw` там `+7 (999) 12`, с `.raw` — `7999912`.
- Пустое поле при уходе очищается — видна обычная подсказка `placeholder`. Частично заполненное сохраняет шаблон.
- У числовых масок шаблона нет: их длина не фиксирована.

## С tinyval-vue

`v-mask` работает на [`<TvField>`](@/tinyval-vue/api/components) и на любом поле формы [tinyval-vue](@/tinyval-vue/). С `.raw` в форму сразу попадают цифры, и схема проверяет их без `unmask`:
:::

::: en
- The template doesn't go into `v-model`: without `.raw` it holds `+7 (999) 12`, with `.raw` — `7999912`.
- An empty field is cleared on blur — the regular `placeholder` hint is shown. A partially filled one keeps the template.
- Number masks have no template: their length isn't fixed.

## With tinyval-vue

`v-mask` works on [`<TvField>`](@/tinyval-vue/api/components) and on any [tinyval-vue](@/tinyval-vue/) form field. With `.raw` the form gets the digits right away, and the schema validates them without `unmask`:
:::

::: zh
- 模板不会进入 `v-model`：不使用 `.raw` 时为 `+7 (999) 12`，使用 `.raw` 时为 `7999912`。
- 空输入框失去焦点时会被清空 —— 显示普通的 `placeholder` 提示。部分填写的输入框会保留模板。
- 数字掩码没有模板：它们的长度不固定。

## 与 tinyval-vue 一起使用

`v-mask` 可以用于 [`<TvField>`](@/tinyval-vue/api/components) 以及任何 [tinyval-vue](@/tinyval-vue/) 表单字段。使用 `.raw` 时表单直接得到数字，Schema 无需 `unmask` 即可校验：
:::

```vue
<script setup lang="ts">
import { object, string, pipe, length } from 'tinyval';
import { useForm, TvForm, TvField, TvError } from 'tinyval-vue';
import { phone } from 'tinyval-mask/presets';
import { vMask } from 'tinyval-mask/vue';

const phoneMask = phone();

const Contact = object({
  phone: pipe(string(), length(11)),
});

const form = useForm(Contact, { initial: { phone: '' } });
</script>

<template>
  <TvForm :form="form" @submit="(data) => api.post('/contacts', data)">
    <TvField name="phone" v-mask.raw="{ mask: phoneMask, placeholder: '_' }" inputmode="tel" />
    <TvError name="phone" />
  </TvForm>
</template>
```

::: ru
В поле — `+7 (999) 123-45-67`, в `form.values.phone` и в `data` — `79991234567`.

## UI-библиотеки
:::

::: en
The field shows `+7 (999) 123-45-67`; `form.values.phone` and `data` have `79991234567`.

## UI libraries
:::

::: zh
字段中显示 `+7 (999) 123-45-67`；`form.values.phone` 和 `data` 中为 `79991234567`。

## UI 组件库
:::

```vue
<el-input v-model="tel" v-mask="phoneMask" />
<v-text-field v-model="tel" v-mask="phoneMask" />
```

## @t(see)

::: ru
- [vMask](~/api/v-mask)
- [Маски и валидация](~/guide/validation)
:::

::: en
- [vMask](~/api/v-mask)
- [Masks & validation](~/guide/validation)
:::

::: zh
- [vMask](~/api/v-mask)
- [掩码与校验](~/guide/validation)
:::
