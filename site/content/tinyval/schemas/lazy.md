::: ru
Схема, которая выбирается в момент проверки. Два случая:

- **Рекурсия** — данные содержат сами себя: категории с подкатегориями, комментарии с ответами, меню.
- **Схема по значению или соседним полям** — например, у организации ИНН из 10 цифр и обязательный КПП, у физлица — 12 цифр и без КПП.
:::

::: en
A schema chosen at validation time. Two cases:

- **Recursion** — data that contains itself: categories with subcategories, comments with replies, menus.
- **A schema based on the value or sibling fields** — e.g. a company has a 10-digit tax ID and a required KPP, an individual has 12 digits and no KPP.
:::

::: zh
在校验时才确定的 Schema。两种情况：

- **递归** —— 包含自身的数据：带子分类的分类、带回复的评论、菜单。
- **根据值或同级字段选择 Schema** —— 例如机构的税号为 10 位且必须有 KPP，个人为 12 位且没有 KPP。
:::

## @t(signature)

```ts
function lazy<T>(getter: (value: unknown, info: { parent: unknown; root: unknown }) => Schema<T>): Schema<T>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `getter` | `(value, { parent, root }) => Schema<T>` | Функция, которая возвращает схему. Вызывается при каждой проверке и получает значение, объект с соседними полями и все данные. Для рекурсии аргументы не нужны: `() => Category` |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `getter` | `(value, { parent, root }) => Schema<T>` | A function returning the schema. Called on every validation with the value, the object with sibling fields and all data. Recursion needs no arguments: `() => Category` |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `getter` | `(value, { parent, root }) => Schema<T>` | 返回 Schema 的函数。每次校验时调用，接收值、包含同级字段的对象以及全部数据。递归时不需要参数：`() => Category` |
:::

## @t(notes)

::: ru
- TypeScript не может вывести рекурсивный тип сам, поэтому тип нужно объявить и указать у схемы: `const Category: Schema<Category> = ...`.
- **Защита от глубоких данных.** Если клиент пришлёт вложенность в десятки тысяч уровней, обычная рекурсия уронит процесс переполнением стека. `lazy` останавливается на глубине `maxDepth` (по умолчанию 256) и возвращает ошибку `depth` — сервер ответит 422, а не упадёт. Лимит меняется опцией `maxDepth` у [`validate`](~/api/validate).
:::

::: en
- TypeScript can't infer a recursive type by itself, so declare the type and annotate the schema: `const Category: Schema<Category> = ...`.
- **Protection from deep data.** If a client sends tens of thousands of nesting levels, plain recursion crashes the process with a stack overflow. `lazy` stops at `maxDepth` (256 by default) and returns a `depth` error — the server answers 422 instead of crashing. Change the limit with the `maxDepth` option of [`validate`](~/api/validate).
:::

::: zh
- TypeScript 无法自行推导递归类型，因此需要声明类型并标注在 Schema 上：`const Category: Schema<Category> = ...`。
- **防止过深的数据。** 如果客户端发送数万层嵌套的数据，普通递归会因栈溢出导致进程崩溃。`lazy` 在达到 `maxDepth`（默认 256）时停止并返回 `depth` 错误 —— 服务端返回 422 而不是崩溃。可以通过 [`validate`](~/api/validate) 的 `maxDepth` 选项修改限制。
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `depth` | Вложенность больше `maxDepth` | Too deeply nested (max &#123;max&#125;) |
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `depth` | Nesting is deeper than `maxDepth` | Too deeply nested (max &#123;max&#125;) |
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `depth` | 嵌套超过 `maxDepth` | Too deeply nested (max &#123;max&#125;) |
:::

## @t(examples)

::: ru
### Дерево категорий
:::

::: en
### Category tree
:::

::: zh
### 分类树
:::

```ts
import { object, string, array, optional, lazy, type Schema } from 'tinyval';

type Category = { name: string; children?: Category[] };

const Category: Schema<Category> = object({
  name: string(),
  children: optional(array(lazy(() => Category))),
});

validate(Category, { name: 'root', children: [{ name: 'a', children: [{}] }] }).errors;
// { 'children.0.children.0.name': 'Required' }
```

::: ru
### Схема по соседнему полю
:::

::: en
### Schema based on a sibling field
:::

::: zh
### 根据同级字段选择 Schema
:::

```ts
const Company = object({
  type: oneOf(['person', 'org']),
  inn: lazy((_, { parent }) => pipe(string(), length(parent.type === 'org' ? 10 : 12), inn())),
  kpp: lazy((_, { parent }) => (parent.type === 'org' ? pipe(string(), pattern(/^\d{4}[\dA-Z]{2}\d{3}$/)) : optional(string()))),
});

validate(Company, { type: 'org', inn: '500100732259' }).errors;
// { inn: 'Must be exactly 10 characters long', kpp: 'Required' }
```

::: ru
### Схема по значению
:::

::: en
### Schema based on the value
:::

::: zh
### 根据值选择 Schema
:::

```ts
// id: a number or a UUID string
const id = lazy((value) => (typeof value === 'number' ? pipe(number(), integer()) : pipe(string(), uuid())));
```

::: ru
Для типов TypeScript все ветки должны возвращать схему одного типа или типа-объединения: для вариантов с разной структурой удобнее [`variant`](~/schemas/variant) или [`union`](~/schemas/union).
:::

::: en
For TypeScript types all branches should return a schema of the same type or a union type: for variants with different structure [`variant`](~/schemas/variant) or [`union`](~/schemas/union) are handier.
:::

::: zh
为了 TypeScript 类型，所有分支应返回相同类型或联合类型的 Schema：结构不同的变体更适合用 [`variant`](~/schemas/variant) 或 [`union`](~/schemas/union)。
:::

::: ru
### Комментарии с ответами
:::

::: en
### Comments with replies
:::

::: zh
### 带回复的评论
:::

```ts
type Comment = { text: string; replies: Comment[] };

const Comment: Schema<Comment> = object({
  text: pipe(string(), trim(), minLength(1), maxLength(2000)),
  replies: optional(array(lazy(() => Comment)), () => []),
});

parse(Comment, body, { maxDepth: 10 }); // no more than 10 reply levels
```

## @t(see)

::: ru
- [object](~/schemas/object), [array](~/schemas/array)
- [TypeScript](~/guide/typescript)
:::

::: en
- [object](~/schemas/object), [array](~/schemas/array)
- [TypeScript](~/guide/typescript)
:::

::: zh
- [object](~/schemas/object)、[array](~/schemas/array)
- [TypeScript](~/guide/typescript)
:::
