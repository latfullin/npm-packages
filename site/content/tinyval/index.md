::: ru
Маленькая и быстрая валидация без зависимостей — для браузера и сервера.

- ~1.4 kB gzip для типичной формы, ~2.3 kB весь пакет — в сборку попадает только то, что импортировано
- Типы TypeScript выводятся из схемы
- Вложенные объекты и массивы, лишние поля, приведение типов, преобразования, асинхронные проверки

## Установка
:::

::: en
Tiny, fast, zero-dependency validation for browser and server.

- ~1.4 kB gzip for a typical form, ~2.3 kB for everything — only what you import ends up in the bundle
- TypeScript types inferred from the schema
- Nested objects and arrays, unknown keys handling, coercion, transforms, async checks

## Install
:::

::: zh
小巧、快速、零依赖的数据校验库 —— 适用于浏览器和服务端。

- 典型表单约 1.4 kB gzip，整个包约 2.3 kB —— 只有导入的部分才会进入打包结果
- TypeScript 类型从 Schema 推导
- 嵌套对象和数组、多余字段处理、类型转换、数据转换、异步检查

## 安装
:::

```bash
npm install tinyval
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

<TinyvalDemo />

::: ru
## Быстрый старт

```ts
import { validate, object, string, optional, pipe, trim, minLength, email, min, coerce, type Infer } from 'tinyval';

const User = object({
  name: pipe(string(), trim(), minLength(2)),
  email: pipe(string(), trim(), email()),
  age: optional(pipe(coerce.number(), min(0))),
});

type User = Infer<typeof User>; // { name: string; email: string; age?: number }

const result = validate(User, input);

if (result.valid) {
  result.data;   // очищенные типизированные данные
} else {
  result.errors; // { name: '...', email: '...' }
}
```

На сервере удобнее [`parse`](~/api/parse) — он возвращает данные или бросает [`ValidationError`](~/api/validation-error).

## Из чего состоит

| Раздел | Что внутри |
| --- | --- |
| [Функции](~/api/validate) | Запуск проверки: [`validate`](~/api/validate), [`validateAsync`](~/api/validate-async), [`parse`](~/api/parse), [`parseAsync`](~/api/parse-async) |
| [Схемы](~/schemas/string) | Типы данных: [`string`](~/schemas/string), [`number`](~/schemas/number), [`object`](~/schemas/object), [`array`](~/schemas/array), [`optional`](~/schemas/optional), [`coerce`](~/schemas/coerce)… |
| [Правила](~/actions/pipe) | Проверки и преобразования через [`pipe`](~/actions/pipe): [`minLength`](~/actions/min-length), [`email`](~/actions/email), [`sameAs`](~/actions/same-as), [`trim`](~/actions/trim), [`check`](~/actions/check)… |

## Что почитать

- [Пустые значения](~/guide/empty-values) — почему `''` считается незаполненным полем
- [Сообщения и локализация](~/guide/messages) — свои тексты ошибок и русский язык
- [TypeScript](~/guide/typescript) — типы из схемы
- [Свои правила и схемы](~/guide/custom-rules) — когда встроенных не хватает
:::

::: en
## Quick start

```ts
import { validate, object, string, optional, pipe, trim, minLength, email, min, coerce, type Infer } from 'tinyval';

const User = object({
  name: pipe(string(), trim(), minLength(2)),
  email: pipe(string(), trim(), email()),
  age: optional(pipe(coerce.number(), min(0))),
});

type User = Infer<typeof User>; // { name: string; email: string; age?: number }

const result = validate(User, input);

if (result.valid) {
  result.data;   // cleaned, typed data
} else {
  result.errors; // { name: '...', email: '...' }
}
```

On the server [`parse`](~/api/parse) is handier — it returns the data or throws [`ValidationError`](~/api/validation-error).

## What's inside

| Section | Contents |
| --- | --- |
| [Functions](~/api/validate) | Running validation: [`validate`](~/api/validate), [`validateAsync`](~/api/validate-async), [`parse`](~/api/parse), [`parseAsync`](~/api/parse-async) |
| [Schemas](~/schemas/string) | Data types: [`string`](~/schemas/string), [`number`](~/schemas/number), [`object`](~/schemas/object), [`array`](~/schemas/array), [`optional`](~/schemas/optional), [`coerce`](~/schemas/coerce)… |
| [Rules](~/actions/pipe) | Checks and transforms via [`pipe`](~/actions/pipe): [`minLength`](~/actions/min-length), [`email`](~/actions/email), [`sameAs`](~/actions/same-as), [`trim`](~/actions/trim), [`check`](~/actions/check)… |

## Further reading

- [Empty values](~/guide/empty-values) — why `''` is treated as a missing value
- [Messages & i18n](~/guide/messages) — custom error texts and locales
- [TypeScript](~/guide/typescript) — types from schemas
- [Custom rules & schemas](~/guide/custom-rules) — when built-ins are not enough
:::

::: zh
## 快速开始

```ts
import { validate, object, string, optional, pipe, trim, minLength, email, min, coerce, type Infer } from 'tinyval';

const User = object({
  name: pipe(string(), trim(), minLength(2)),
  email: pipe(string(), trim(), email()),
  age: optional(pipe(coerce.number(), min(0))),
});

type User = Infer<typeof User>; // { name: string; email: string; age?: number }

const result = validate(User, input);

if (result.valid) {
  result.data;   // 清洗后的、带类型的数据
} else {
  result.errors; // { name: '...', email: '...' }
}
```

在服务端使用 [`parse`](~/api/parse) 更方便 —— 它返回数据或抛出 [`ValidationError`](~/api/validation-error)。

## 组成部分

| 部分 | 内容 |
| --- | --- |
| [函数](~/api/validate) | 执行校验：[`validate`](~/api/validate)、[`validateAsync`](~/api/validate-async)、[`parse`](~/api/parse)、[`parseAsync`](~/api/parse-async) |
| [Schema](~/schemas/string) | 数据类型：[`string`](~/schemas/string)、[`number`](~/schemas/number)、[`object`](~/schemas/object)、[`array`](~/schemas/array)、[`optional`](~/schemas/optional)、[`coerce`](~/schemas/coerce)… |
| [规则](~/actions/pipe) | 通过 [`pipe`](~/actions/pipe) 进行检查和转换：[`minLength`](~/actions/min-length)、[`email`](~/actions/email)、[`sameAs`](~/actions/same-as)、[`trim`](~/actions/trim)、[`check`](~/actions/check)… |

## 延伸阅读

- [空值](~/guide/empty-values) —— 为什么 `''` 被视为未填写
- [错误信息与国际化](~/guide/messages) —— 自定义错误文本和语言包
- [TypeScript](~/guide/typescript) —— 从 Schema 获取类型
- [自定义规则与 Schema](~/guide/custom-rules) —— 内置规则不够用时
:::
