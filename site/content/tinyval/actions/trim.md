::: ru
Удаляет пробелы в начале и в конце строки. Результат попадает в `data`.
:::

::: en
Removes whitespace from both ends of the string. The result goes to `data`.
:::

::: zh
去除字符串首尾的空白字符。结果写入 `data`。
:::

## @t(signature)

```ts
function trim(): Action<string>
```

## @t(notes)

::: ru
- Порядок важен: ставьте `trim()` перед проверками длины.
- Строка из одних пробелов после `trim()` станет `''`, но ошибки `required` не будет — проверка «пустоты» уже прошла. Добавьте `minLength(1)`.
:::

::: en
- Order matters: put `trim()` before length checks.
- A whitespace-only string becomes `''` after `trim()`, but there is no `required` error — the emptiness check has already passed. Add `minLength(1)`.
:::

::: zh
- 顺序很重要：把 `trim()` 放在长度检查之前。
- 只包含空格的字符串经过 `trim()` 后变为 `''`，但不会产生 `required` 错误 —— 空值检查已经完成。请添加 `minLength(1)`。
:::

## @t(example)

::: ru
### Имя

```ts
pipe(string(), trim(), minLength(1, 'Введите имя'))
```
:::

::: en
### Name

```ts
pipe(string(), trim(), minLength(1, 'Please enter your name'))
```
:::

::: zh
### 姓名

```ts
pipe(string(), trim(), minLength(1, '请输入姓名'))
```
:::

## @t(see)

::: ru
- [toLowerCase](~/actions/to-lower-case)
- [toUpperCase](~/actions/to-upper-case)
- [Пустые значения](~/guide/empty-values)
:::

::: en
- [toLowerCase](~/actions/to-lower-case)
- [toUpperCase](~/actions/to-upper-case)
- [Empty values](~/guide/empty-values)
:::

::: zh
- [toLowerCase](~/actions/to-lower-case)
- [toUpperCase](~/actions/to-upper-case)
- [空值](~/guide/empty-values)
:::
