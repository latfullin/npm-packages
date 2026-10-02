::: ru
[Standard Schema](https://standardschema.dev) — общий стандарт для библиотек валидации. Его поддерживают tRPC, Hono, TanStack Form, React Hook Form, Nuxt UI и другие. Все схемы tinyval реализуют этот стандарт, поэтому их можно передавать в такие библиотеки напрямую — без адаптеров.
:::

::: en
[Standard Schema](https://standardschema.dev) is a common standard for validation libraries. It is supported by tRPC, Hono, TanStack Form, React Hook Form, Nuxt UI and others. Every tinyval schema implements it, so you can pass schemas to these libraries directly — no adapters needed.
:::

::: zh
[Standard Schema](https://standardschema.dev) 是校验库的通用标准，tRPC、Hono、TanStack Form、React Hook Form、Nuxt UI 等都支持它。所有 tinyval Schema 都实现了该标准，因此可以直接传给这些库 —— 无需适配器。
:::

::: ru
## Как это работает

У каждой схемы есть свойство `~standard` с методом `validate` и типами входа и выхода:
:::

::: en
## How it works

Every schema has a `~standard` property with a `validate` method and input/output types:
:::

::: zh
## 工作方式

每个 Schema 都有一个 `~standard` 属性，包含 `validate` 方法以及输入和输出类型：
:::

```ts
const result = User['~standard'].validate(input);
// { value: { ... } } or { issues: [{ message: 'Invalid email', path: ['email'] }] }
```

::: ru
- Если в схеме есть [`checkAsync`](~/actions/check-async), `validate` возвращает `Promise`.
- Сообщения об ошибках — те же, что в [`validate`](~/api/validate), включая [`setMessages`](~/api/set-messages).
- Свои схемы, созданные через [`createSchema`](~/api/create-schema), тоже поддерживают стандарт.
:::

::: en
- If the schema contains [`checkAsync`](~/actions/check-async), `validate` returns a `Promise`.
- Error messages are the same as in [`validate`](~/api/validate), including [`setMessages`](~/api/set-messages).
- Custom schemas created with [`createSchema`](~/api/create-schema) support the standard too.
:::

::: zh
- 如果 Schema 中包含 [`checkAsync`](~/actions/check-async)，`validate` 返回 `Promise`。
- 错误信息与 [`validate`](~/api/validate) 相同，包括 [`setMessages`](~/api/set-messages) 的设置。
- 通过 [`createSchema`](~/api/create-schema) 创建的自定义 Schema 同样支持该标准。
:::

## @t(examples)

### tRPC

```ts
export const appRouter = t.router({
  createUser: t.procedure.input(CreateUser).mutation(({ input }) => db.users.create(input)),
});
```

### Hono

```ts
import { sValidator } from '@hono/standard-validator';

app.post('/users', sValidator('json', CreateUser), (c) => {
  const user = c.req.valid('json'); // typed
  return c.json(user, 201);
});
```

### TanStack Form

```ts
const form = useForm({
  defaultValues: { name: '', email: '' },
  validators: { onChange: CreateUser },
});
```

### React Hook Form

```ts
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

const form = useForm({ resolver: standardSchemaResolver(CreateUser) });
```

## @t(see)

::: ru
- [createSchema](~/api/create-schema) — свои схемы с поддержкой стандарта
- [TypeScript](~/guide/typescript)
:::

::: en
- [createSchema](~/api/create-schema) — custom schemas with standard support
- [TypeScript](~/guide/typescript)
:::

::: zh
- [createSchema](~/api/create-schema)：支持该标准的自定义 Schema
- [TypeScript](~/guide/typescript)
:::
