::: ru
Встроенных правил не хватает? Своё правило — это обычная функция. Для сложных случаев можно написать и свою схему.

## Своё правило через check

Самый простой способ — [`check`](~/actions/check). Оберните его в функцию, чтобы переиспользовать и передавать сообщение:

```ts
import { check, pipe, number, string } from 'tinyval';

const even = (msg = 'Должно быть чётным') => check<number>((v) => v % 2 === 0, msg);
const noSpaces = (msg = 'Без пробелов') => check<string>((v) => !/\s/.test(v), msg);

pipe(number(), even());
pipe(string(), noSpaces());
```

Проверка получает вторым аргументом соседние поля (`parent`) и все данные (`root`):

```ts
const after = (field: string, msg = 'Должно быть позже') =>
  check<Date>((v, { parent }) => v > (parent as any)[field], msg);

object({
  start: coerce.date(),
  end: pipe(coerce.date(), after('start')),
});
```

## Асинхронное правило

```ts
const unique = (table: string) =>
  checkAsync<string>(async (v) => !(await db.exists(table, v)), 'Уже занято');

const Signup = object({ email: pipe(string(), email(), unique('users')) });
await validateAsync(Signup, body);
```

Подробнее — [checkAsync](~/actions/check-async).

## Своя схема

Схему создаёт [`createSchema`](~/api/create-schema) из функции проверки. Функция возвращает значение (возможно, преобразованное) или результат `fail(...)`. Пример схемы для `bigint`:
:::

::: en
Not enough built-in rules? A custom rule is just a function. For complex cases you can write your own schema.

## A rule with check

The easiest way is [`check`](~/actions/check). Wrap it in a function to reuse it and pass a message:

```ts
import { check, pipe, number, string } from 'tinyval';

const even = (msg = 'Must be even') => check<number>((v) => v % 2 === 0, msg);
const noSpaces = (msg = 'No spaces allowed') => check<string>((v) => !/\s/.test(v), msg);

pipe(number(), even());
pipe(string(), noSpaces());
```

The second argument gives access to sibling fields (`parent`) and all data (`root`):

```ts
const after = (field: string, msg = 'Must be later') =>
  check<Date>((v, { parent }) => v > (parent as any)[field], msg);

object({
  start: coerce.date(),
  end: pipe(coerce.date(), after('start')),
});
```

## An async rule

```ts
const unique = (table: string) =>
  checkAsync<string>(async (v) => !(await db.exists(table, v)), 'Already taken');

const Signup = object({ email: pipe(string(), email(), unique('users')) });
await validateAsync(Signup, body);
```

More — [checkAsync](~/actions/check-async).

## A custom schema

[`createSchema`](~/api/create-schema) creates a schema from a validation function. The function returns the value (possibly transformed) or the result of `fail(...)`. A schema for `bigint`:
:::

::: zh
内置规则不够用？自定义规则就是一个普通函数。对于复杂情况，还可以编写自己的 Schema。

## 用 check 编写规则

最简单的方式是 [`check`](~/actions/check)。把它包装成函数，便于复用和传入信息：

```ts
import { check, pipe, number, string } from 'tinyval';

const even = (msg = '必须是偶数') => check<number>((v) => v % 2 === 0, msg);
const noSpaces = (msg = '不能包含空格') => check<string>((v) => !/\s/.test(v), msg);

pipe(number(), even());
pipe(string(), noSpaces());
```

第二个参数可以访问同级字段（`parent`）和全部数据（`root`）：

```ts
const after = (field: string, msg = '必须晚于开始时间') =>
  check<Date>((v, { parent }) => v > (parent as any)[field], msg);

object({
  start: coerce.date(),
  end: pipe(coerce.date(), after('start')),
});
```

## 异步规则

```ts
const unique = (table: string) =>
  checkAsync<string>(async (v) => !(await db.exists(table, v)), '已被占用');

const Signup = object({ email: pipe(string(), email(), unique('users')) });
await validateAsync(Signup, body);
```

更多内容见 [checkAsync](~/actions/check-async)。

## 自定义 Schema

[`createSchema`](~/api/create-schema) 用校验函数创建 Schema。函数返回值（可以是转换后的值）或 `fail(...)` 的结果。`bigint` 的 Schema 示例：
:::

```ts
import { createSchema, fail, isEmpty, type Message } from 'tinyval';

export const bigint = (msg?: Message) =>
  createSchema<bigint>((value, ctx, path) => {
    if (isEmpty(value)) return fail(ctx, path, 'required', msg);
    if (typeof value !== 'bigint') return fail(ctx, path, 'bigint', msg);
    return value;
  });
```

::: ru
- `fail(ctx, path, code, msg?, params?)` — записывает ошибку и возвращает специальный маркер.
- `isEmpty(value)` — `true` для `undefined`, `null` и `''`.
- Для своего кода ошибки добавьте текст через [`setMessages`](~/api/set-messages): `setMessages({ bigint: 'Должно быть bigint' })`. Без этого используется сообщение `invalid`.

Своя схема работает везде: в [`object`](~/schemas/object), [`array`](~/schemas/array), [`pipe`](~/actions/pipe), [`optional`](~/schemas/optional), тип выводится через `Infer`, а ещё она поддерживает [Standard Schema](~/guide/standard-schema).
:::

::: en
- `fail(ctx, path, code, msg?, params?)` — records an error and returns a special marker.
- `isEmpty(value)` — `true` for `undefined`, `null` and `''`.
- Add a text for your code via [`setMessages`](~/api/set-messages): `setMessages({ bigint: 'Must be a bigint' })`. Otherwise the `invalid` message is used.

A custom schema works everywhere: in [`object`](~/schemas/object), [`array`](~/schemas/array), [`pipe`](~/actions/pipe), [`optional`](~/schemas/optional), its type is inferred with `Infer`, and it supports [Standard Schema](~/guide/standard-schema).
:::

::: zh
- `fail(ctx, path, code, msg?, params?)` —— 记录错误并返回一个特殊标记。
- `isEmpty(value)` —— 对 `undefined`、`null` 和 `''` 返回 `true`。
- 通过 [`setMessages`](~/api/set-messages) 为自定义代码添加文本：`setMessages({ bigint: '必须是 bigint' })`。否则使用 `invalid` 的信息。

自定义 Schema 可以在任何地方使用：[`object`](~/schemas/object)、[`array`](~/schemas/array)、[`pipe`](~/actions/pipe)、[`optional`](~/schemas/optional)，可以通过 `Infer` 推导类型，并且支持 [Standard Schema](~/guide/standard-schema)。
:::

## @t(see)

::: ru
- [check](~/actions/check)
- [checkAsync](~/actions/check-async)
- [preprocess](~/schemas/preprocess) — когда нужно только подготовить значение
- [transform](~/schemas/transform) — когда нужно изменить результат
:::

::: en
- [check](~/actions/check)
- [checkAsync](~/actions/check-async)
- [preprocess](~/schemas/preprocess) — when you only need to prepare the input
- [transform](~/schemas/transform) — when you need to change the output
:::

::: zh
- [check](~/actions/check)
- [checkAsync](~/actions/check-async)
- [preprocess](~/schemas/preprocess)：只需预处理输入时
- [transform](~/schemas/transform)：需要修改结果时
:::
