::: ru
Задаёт названия полей для параметра `{label}` во всём приложении — как `attributes` в lang-файле Laravel.
:::

::: en
Sets field names for the `{label}` parameter in the whole app — like `attributes` in a Laravel lang file.
:::

::: zh
为整个应用设置 `{label}` 参数的字段名称 —— 类似 Laravel 语言文件中的 `attributes`。
:::

## @t(signature)

```ts
function setLabels(labels: Record<string, string>): void
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `labels` | `Record<string, string>` | Путь поля → название. Для элементов массива — `*`: `'items.*.title'` |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `labels` | `Record<string, string>` | Field path → name. Use `*` for array items: `'items.*.title'` |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `labels` | `Record<string, string>` | 字段路径 → 名称。数组元素使用 `*`：`'items.*.title'` |
:::

## @t(notes)

::: ru
- Приоритет: [`label`](~/schemas/label) в схеме и опция `labels` вызова → `setLabels` → имя поля.
- Вызовы дополняют друг друга: новые названия добавляются к уже заданным.
:::

::: en
- Priority: [`label`](~/schemas/label) in the schema and the call's `labels` option → `setLabels` → the field name.
- Calls add up: new names are added to the existing ones.
:::

::: zh
- 优先级：Schema 中的 [`label`](~/schemas/label) 和调用的 `labels` 选项 → `setLabels` → 字段名。
- 多次调用会合并：新名称会添加到已有名称中。
:::

## @t(example)

```ts
import { setMessages, setLabels } from 'tinyval';

setMessages({ required: '{label} is required' });
setLabels({ email: 'Email address', 'items.*.qty': 'Quantity' });

validate(Order, { items: [{}] }).errors;
// { email: 'Email address is required', 'items.0.qty': 'Quantity is required' }
```

## @t(see)

::: ru
- [Свой lang-файл](~/guide/custom-lang)
- [label](~/schemas/label)
:::

::: en
- [Custom lang file](~/guide/custom-lang)
- [label](~/schemas/label)
:::

::: zh
- [自定义语言文件](~/guide/custom-lang)
- [label](~/schemas/label)
:::
