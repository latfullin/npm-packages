::: ru
Рекурсивная схема — для данных, которые содержат сами себя: категории с подкатегориями, комментарии с ответами, меню.
:::

::: en
A recursive schema — for data that contains itself: categories with subcategories, comments with replies, menus.
:::

::: zh
递归 Schema —— 用于包含自身的数据：带子分类的分类、带回复的评论、菜单。
:::

## @t(signature)

```ts
function lazy<T>(getter: () => Schema<T>): Schema<T>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `getter` | `() => Schema<T>` | Функция, которая возвращает схему. Вызывается при первой проверке — к этому моменту схема уже объявлена |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `getter` | `() => Schema<T>` | A function returning the schema. Called on the first validation — the schema is declared by then |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `getter` | `() => Schema<T>` | 返回 Schema 的函数。在第一次校验时调用 —— 此时 Schema 已经声明 |
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
