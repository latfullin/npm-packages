::: ru
Что возвращают функции масок и что попадает в поле, в `v-model` и в данные. Все примеры — настоящий вывод tinyval-mask.
:::

::: en
What the mask functions return and what ends up in the field, in `v-model` and in your data. Every example is real tinyval-mask output.
:::

::: zh
掩码函数返回什么，以及输入框、`v-model` 和数据中分别是什么值。所有示例都是 tinyval-mask 的真实输出。
:::

::: ru
## Кратко

| Функция | Возвращает | Пример для `phone()` |
| --- | --- | --- |
| [`mask(value, m)`](~/api/mask) | Строку для поля | `'+7 (999) 123-45-67'` |
| [`unmask(value, m)`](~/api/mask) | Строку для данных и базы | `'79991234567'` |
| [`isComplete(value, m)`](~/api/mask) | `true`, если все обязательные позиции заполнены | `true` |
| `m.process(value)` | Всё сразу — объект `MaskResult`, см. ниже | |
| [`attach`](~/api/attach) → `onChange` | `{ value, raw, complete }` при каждом изменении поля | |
| [`v-mask`](~/api/v-mask) + `v-model` | В модели — строка **с маской** | `'+7 (999) 123-45-67'` |

Все функции возвращают **строки**: даже числовая маска отдаёт `'1234.5'`, а не `1234.5` — чтобы не терять ведущие нули и точность. Число получают через `Number(...)` или [`coerce.number`](@/tinyval/schemas/coerce).
:::

::: en
## In short

| Function | Returns | Example for `phone()` |
| --- | --- | --- |
| [`mask(value, m)`](~/api/mask) | A string for the field | `'+7 (999) 123-45-67'` |
| [`unmask(value, m)`](~/api/mask) | A string for data and the database | `'79991234567'` |
| [`isComplete(value, m)`](~/api/mask) | `true` if all required positions are filled | `true` |
| `m.process(value)` | Everything at once — a `MaskResult` object, see below | |
| [`attach`](~/api/attach) → `onChange` | `{ value, raw, complete }` on every field change | |
| [`v-mask`](~/api/v-mask) + `v-model` | The model holds the string **with the mask** | `'+7 (999) 123-45-67'` |

All functions return **strings**: even the number mask returns `'1234.5'`, not `1234.5` — so leading zeros and precision aren't lost. Get a number with `Number(...)` or [`coerce.number`](@/tinyval/schemas/coerce).
:::

::: zh
## 概览

| 函数 | 返回值 | `phone()` 示例 |
| --- | --- | --- |
| [`mask(value, m)`](~/api/mask) | 用于输入框的字符串 | `'+7 (999) 123-45-67'` |
| [`unmask(value, m)`](~/api/mask) | 用于数据和数据库的字符串 | `'79991234567'` |
| [`isComplete(value, m)`](~/api/mask) | 所有必填位置都已填写时为 `true` | `true` |
| `m.process(value)` | 一次返回全部信息 —— `MaskResult` 对象，见下文 | |
| [`attach`](~/api/attach) → `onChange` | 每次输入框变化时得到 `{ value, raw, complete }` | |
| [`v-mask`](~/api/v-mask) + `v-model` | 模型中是**带掩码**的字符串 | `'+7 (999) 123-45-67'` |

所有函数都返回**字符串**：即使是数字掩码也返回 `'1234.5'` 而不是 `1234.5` —— 以免丢失前导零和精度。如需数字，请使用 `Number(...)` 或 [`coerce.number`](@/tinyval/schemas/coerce)。
:::

::: ru
## Что возвращает unmask

Значение без маски зависит от маски — это то, что удобно хранить:

| Маска | В поле | `unmask` |
| --- | --- | --- |
| Свой шаблон `'99-99'` | `12-34` | `'1234'` — введённые символы без литералов |
| `phone()` | `+7 (999) 123-45-67` | `'79991234567'` — все цифры **с кодом страны** |
| `card()` | `4276 1234 5678 9012` | `'4276123456789012'` |
| `numberMask()`, `money()` | `1 234,5 ₽` | `'1234.5'` — формат JavaScript: точка, без пробелов |
| `numberMask({ negative: true })` | `-42` | `'-42'` |
| `carPlate()` | `А 123 ВС 77` | `'А123ВС77'` — кириллицей, даже если вводили латиницей |
| `kpp()`, `mac()` | `7743AB001` | `'7743AB001'` — в верхнем регистре |

Если маска заполнена не до конца, `unmask` вернёт то, что успели ввести: `unmask('8999123', phone())` → `'7999123'`. Проверить заполненность — `isComplete`.
:::

::: en
## What unmask returns

The unmasked value depends on the mask — it's what's convenient to store:

| Mask | In the field | `unmask` |
| --- | --- | --- |
| Custom pattern `'99-99'` | `12-34` | `'1234'` — typed characters without literals |
| `phone()` | `+7 (999) 123-45-67` | `'79991234567'` — all digits **including the country code** |
| `card()` | `4276 1234 5678 9012` | `'4276123456789012'` |
| `numberMask()`, `money()` | `1 234,5 ₽` | `'1234.5'` — JavaScript format: a dot, no spaces |
| `numberMask({ negative: true })` | `-42` | `'-42'` |
| `carPlate()` | `А 123 ВС 77` | `'А123ВС77'` — Cyrillic, even if typed in Latin |
| `kpp()`, `mac()` | `7743AB001` | `'7743AB001'` — upper case |

If the mask isn't fully filled, `unmask` returns what was typed so far: `unmask('8999123', phone())` → `'7999123'`. Check completeness with `isComplete`.
:::

::: zh
## unmask 返回什么

去掉掩码后的值取决于掩码 —— 也就是便于存储的形式：

| 掩码 | 输入框中 | `unmask` |
| --- | --- | --- |
| 自定义模板 `'99-99'` | `12-34` | `'1234'` —— 不含字面量的已输入字符 |
| `phone()` | `+7 (999) 123-45-67` | `'79991234567'` —— **包含国家代码**的全部数字 |
| `card()` | `4276 1234 5678 9012` | `'4276123456789012'` |
| `numberMask()`、`money()` | `1 234,5 ₽` | `'1234.5'` —— JavaScript 格式：句点、无空格 |
| `numberMask({ negative: true })` | `-42` | `'-42'` |
| `carPlate()` | `А 123 ВС 77` | `'А123ВС77'` —— 西里尔字母，即使输入的是拉丁字母 |
| `kpp()`、`mac()` | `7743AB001` | `'7743AB001'` —— 大写 |

如果掩码没有填写完整，`unmask` 返回已输入的部分：`unmask('8999123', phone())` → `'7999123'`。可以用 `isComplete` 检查是否填写完整。
:::

::: ru
## MaskResult — всё сразу

`mask.process(value)` возвращает полный результат. Он нужен, если вы пишете свою привязку к полю или компонент:
:::

::: en
## MaskResult — everything at once

`mask.process(value)` returns the full result. You need it when writing your own field binding or component:
:::

::: zh
## MaskResult —— 一次获取全部信息

`mask.process(value)` 返回完整结果。在编写自定义输入框绑定或组件时需要用到：
:::

```ts
phone().process('8999123');
```

```json
{
  "value": "+7 (999) 123",
  "raw": "999123",
  "complete": false,
  "slots": [4, 5, 6, 9, 10, 11],
  "overflow": false
}
```

::: ru
| Поле | Описание |
| --- | --- |
| `value` | Отформатированное значение — то же, что вернёт `mask` |
| `raw` | Введённые символы на позициях шаблона, без литералов. У телефона здесь **нет** кода страны: `+7` — часть шаблона. Поэтому для данных используйте `unmask`, а не `raw` |
| `complete` | Все обязательные позиции заполнены — то же, что `isComplete` |
| `slots` | Индексы введённых символов в `value` — по ним ставится курсор |
| `overflow` | Во вводе остались символы, которые не поместились: `process('1234567')` для `'99-99'` → `true` |

Почему `raw` и `unmask` различаются: `raw` — служебное значение маски (по нему считается курсор), а `unmask` — значение для данных, и каждая маска решает, каким оно должно быть. Для своих шаблонов они совпадают.
:::

::: en
| Field | Description |
| --- | --- |
| `value` | The formatted value — the same as `mask` returns |
| `raw` | Typed characters in pattern positions, without literals. For a phone it has **no** country code: `+7` is part of the pattern. So use `unmask`, not `raw`, for data |
| `complete` | All required positions are filled — the same as `isComplete` |
| `slots` | Indexes of typed characters in `value` — the caret is placed by them |
| `overflow` | The input had characters that didn't fit: `process('1234567')` for `'99-99'` → `true` |

Why `raw` and `unmask` differ: `raw` is the mask's internal value (the caret is computed from it), while `unmask` is the value for data, and each mask decides what it should be. For custom patterns they are the same.
:::

::: zh
| 字段 | 说明 |
| --- | --- |
| `value` | 格式化后的值 —— 与 `mask` 的返回值相同 |
| `raw` | 模板位置上已输入的字符，不含字面量。对于电话，这里**不包含**国家代码：`+7` 是模板的一部分。因此数据请使用 `unmask` 而不是 `raw` |
| `complete` | 所有必填位置都已填写 —— 与 `isComplete` 相同 |
| `slots` | 已输入字符在 `value` 中的索引 —— 用于定位光标 |
| `overflow` | 输入中有放不下的字符：对 `'99-99'` 调用 `process('1234567')` → `true` |

为什么 `raw` 和 `unmask` 不同：`raw` 是掩码的内部值（用于计算光标），而 `unmask` 是用于数据的值，由每个掩码决定其形式。对于自定义模板，两者相同。
:::

::: ru
## В поле, в v-model и в данных

С [`v-mask`](~/api/v-mask) или [`attach`](~/api/attach):

| Где | Значение |
| --- | --- |
| В `<input>` | `+7 (999) 123-45-67` |
| В `v-model` | `'+7 (999) 123-45-67'` — то же, что в поле |
| В `onChange` у `attach` | `{ value: '+7 (999) 123-45-67', raw: '79991234567', complete: true }` — здесь `raw` уже результат `unmask` |
| В данных для сервера | `'79991234567'` — после `unmask` в схеме, см. [Маски и валидация](~/guide/validation) |

Модель хранит значение с маской специально: так поле и модель всегда совпадают, а «чистое» значение получается в одном месте — в схеме перед отправкой.
:::

::: en
## In the field, in v-model and in data

With [`v-mask`](~/api/v-mask) or [`attach`](~/api/attach):

| Where | Value |
| --- | --- |
| In the `<input>` | `+7 (999) 123-45-67` |
| In `v-model` | `'+7 (999) 123-45-67'` — the same as in the field |
| In `attach`'s `onChange` | `{ value: '+7 (999) 123-45-67', raw: '79991234567', complete: true }` — here `raw` is already the `unmask` result |
| In data for the server | `'79991234567'` — after `unmask` in the schema, see [Masks & validation](~/guide/validation) |

The model keeps the masked value on purpose: the field and the model always match, and the "clean" value is produced in one place — in the schema before sending.
:::

::: zh
## 输入框、v-model 和数据中的值

使用 [`v-mask`](~/api/v-mask) 或 [`attach`](~/api/attach) 时：

| 位置 | 值 |
| --- | --- |
| `<input>` 中 | `+7 (999) 123-45-67` |
| `v-model` 中 | `'+7 (999) 123-45-67'` —— 与输入框中相同 |
| `attach` 的 `onChange` 中 | `{ value: '+7 (999) 123-45-67', raw: '79991234567', complete: true }` —— 这里的 `raw` 已经是 `unmask` 的结果 |
| 发送给服务端的数据中 | `'79991234567'` —— 在 Schema 中经过 `unmask` 之后，见 [掩码与校验](~/guide/validation) |

模型有意保存带掩码的值：这样输入框和模型始终一致，而“纯”值只在一个地方生成 —— 提交前在 Schema 中处理。
:::

## @t(see)

::: ru
- [mask, unmask, isComplete](~/api/mask)
- [Готовые маски](~/api/presets) — пример значения без маски для каждой
- [Маски и валидация](~/guide/validation)
:::

::: en
- [mask, unmask, isComplete](~/api/mask)
- [Ready-made masks](~/api/presets) — an unmasked example for each
- [Masks & validation](~/guide/validation)
:::

::: zh
- [mask、unmask、isComplete](~/api/mask)
- [预设掩码](~/api/presets)：每种掩码去掉掩码后的示例
- [掩码与校验](~/guide/validation)
:::
