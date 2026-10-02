::: ru
tinyval написан на TypeScript. Тип данных выводится из схемы, поэтому отдельно описывать интерфейс не нужно.

## Infer — тип из схемы
:::

::: en
tinyval is written in TypeScript. The data type is inferred from the schema, so you don't need to declare an interface separately.

## Infer — type from a schema
:::

::: zh
tinyval 使用 TypeScript 编写。数据类型从 Schema 推导而来，无需另外声明接口。

## Infer —— 从 Schema 获取类型
:::

```ts
import { object, string, number, optional, array, oneOf, type Infer } from 'tinyval';

const User = object({
  name: string(),
  age: optional(number()),
  role: oneOf(['admin', 'user']),
  tags: array(string()),
});

type User = Infer<typeof User>;
// {
//   name: string;
//   role: 'admin' | 'user';
//   tags: string[];
//   age?: number | undefined;
// }
```

::: ru
Поля, обёрнутые в [`optional`](~/schemas/optional) без значения по умолчанию, становятся необязательными (`?`). С [`transform`](~/schemas/transform) в тип попадает результат преобразования.

## Сужение типа результата

[`validate`](~/api/validate) возвращает объединение: после проверки `valid` TypeScript знает, есть ли `data`:
:::

::: en
Fields wrapped in [`optional`](~/schemas/optional) without a default become optional (`?`). With [`transform`](~/schemas/transform) the type is the result of the transformation.

## Narrowing the result

[`validate`](~/api/validate) returns a union: after checking `valid`, TypeScript knows whether `data` exists:
:::

::: zh
用 [`optional`](~/schemas/optional) 包裹且没有默认值的字段会变为可选（`?`）。使用 [`transform`](~/schemas/transform) 时，类型为转换后的结果。

## 收窄结果类型

[`validate`](~/api/validate) 返回联合类型：检查 `valid` 之后，TypeScript 就知道是否存在 `data`：
:::

```ts
const result = validate(User, input);

if (result.valid) {
  result.data.name; // string
} else {
  result.data;      // undefined
  result.errors;    // Record<string, string>
}
```

::: ru
[`parse`](~/api/parse) сразу возвращает `Infer<typeof User>`.

## Проверка совместимости правил

Правило должно подходить к типу схемы — ошибка видна ещё до запуска:

```ts
pipe(number(), minLength(2)); // ошибка: minLength работает со строками и массивами
pipe(string(), min(1));       // ошибка: min работает с числами
```

## Типы в своих проверках

У [`check`](~/actions/check) тип значения можно указать явно:

```ts
const even = check<number>((v) => v % 2 === 0, 'Должно быть чётным');
```

## Экспортируемые типы

| Тип | Описание |
| --- | --- |
| `Schema<T>` | Схема, которая возвращает значение типа `T` |
| `Infer<S>` | Тип данных схемы `S` |
| `Result<T>` | Результат [`validate`](~/api/validate) |
| `Issue` | Ошибка: `{ code, message, path, params }` |
| `Message` | Строка или функция `(params) => string` |
| `Options` | Опции проверки: `{ all?, messages?, labels?, maxDepth? }` — см. [validate](~/api/validate) |
| `Action<T>` | Правило или преобразование для [`pipe`](~/actions/pipe) |
| `Info` | Второй аргумент [`check`](~/actions/check): `{ parent, root }` |
:::

::: en
[`parse`](~/api/parse) returns `Infer<typeof User>` directly.

## Rule compatibility

A rule must match the schema type — the error is shown before you run the code:

```ts
pipe(number(), minLength(2)); // error: minLength works with strings and arrays
pipe(string(), min(1));       // error: min works with numbers
```

## Types in custom checks

The value type of [`check`](~/actions/check) can be set explicitly:

```ts
const even = check<number>((v) => v % 2 === 0, 'Must be even');
```

## Exported types

| Type | Description |
| --- | --- |
| `Schema<T>` | A schema that returns a value of type `T` |
| `Infer<S>` | The data type of schema `S` |
| `Result<T>` | The result of [`validate`](~/api/validate) |
| `Issue` | An error: `{ code, message, path, params }` |
| `Message` | A string or a function `(params) => string` |
| `Options` | Validation options: `{ all?, messages?, labels?, maxDepth? }` — see [validate](~/api/validate) |
| `Action<T>` | A rule or transform for [`pipe`](~/actions/pipe) |
| `Info` | The second argument of [`check`](~/actions/check): `{ parent, root }` |
:::

::: zh
[`parse`](~/api/parse) 直接返回 `Infer<typeof User>`。

## 规则兼容性检查

规则必须与 Schema 类型匹配 —— 运行之前就能看到错误：

```ts
pipe(number(), minLength(2)); // 错误：minLength 用于字符串和数组
pipe(string(), min(1));       // 错误：min 用于数字
```

## 自定义检查中的类型

可以显式指定 [`check`](~/actions/check) 的值类型：

```ts
const even = check<number>((v) => v % 2 === 0, '必须是偶数');
```

## 导出的类型

| 类型 | 说明 |
| --- | --- |
| `Schema<T>` | 返回 `T` 类型值的 Schema |
| `Infer<S>` | Schema `S` 的数据类型 |
| `Result<T>` | [`validate`](~/api/validate) 的结果 |
| `Issue` | 错误：`{ code, message, path, params }` |
| `Message` | 字符串或函数 `(params) => string` |
| `Options` | 校验选项：`{ all?, messages?, labels?, maxDepth? }` —— 见 [validate](~/api/validate) |
| `Action<T>` | [`pipe`](~/actions/pipe) 的规则或转换 |
| `Info` | [`check`](~/actions/check) 的第二个参数：`{ parent, root }` |
:::

## @t(see)

::: ru
- [Свои правила и схемы](~/guide/custom-rules)
- [validate](~/api/validate)
:::

::: en
- [Custom rules & schemas](~/guide/custom-rules)
- [validate](~/api/validate)
:::

::: zh
- [自定义规则与 Schema](~/guide/custom-rules)
- [validate](~/api/validate)
:::
