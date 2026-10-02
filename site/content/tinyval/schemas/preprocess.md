::: ru
Подготавливает входное значение **до** проверки. Удобно, когда данные приходят в неудобном формате.
:::

::: en
Prepares the input value **before** validation. Handy when data comes in an inconvenient format.
:::

::: zh
在校验**之前**预处理输入值。适用于数据格式不方便的情况。
:::

## @t(signature)

```ts
function preprocess<T>(fn: (value: unknown) => unknown, schema: Schema<T>): Schema<T>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `fn` | `(value: unknown) => unknown` | Функция подготовки. Получает исходное значение — любого типа |
| `schema` | `Schema<T>` | Схема, которая проверит результат `fn` |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `fn` | `(value: unknown) => unknown` | The preparation function. Receives the raw value of any type |
| `schema` | `Schema<T>` | The schema that validates the result of `fn` |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `fn` | `(value: unknown) => unknown` | 预处理函数。接收任意类型的原始值 |
| `schema` | `Schema<T>` | 校验 `fn` 结果的 Schema |
:::

## @t(notes)

::: ru
- `fn` получает **непроверенные** данные: учитывайте, что там может быть что угодно.
- На `preprocess` построены все функции [`coerce`](~/schemas/coerce).
:::

::: en
- `fn` receives **unvalidated** data: it can be anything.
- All [`coerce`](~/schemas/coerce) functions are built on `preprocess`.
:::

::: zh
- `fn` 接收的是**未经校验**的数据：可能是任何值。
- 所有 [`coerce`](~/schemas/coerce) 函数都基于 `preprocess` 实现。
:::

## @t(examples)

::: ru
### Дробное число с запятой
:::

::: en
### Decimal number with a comma
:::

::: zh
### 带逗号的小数
:::

```ts
const amount = preprocess(
  (v) => (typeof v === 'string' ? Number(v.replace(',', '.')) : v),
  number(),
);

validate(amount, '1,5').data; // 1.5
```

::: ru
### JSON в строке
:::

::: en
### JSON in a string
:::

::: zh
### 字符串中的 JSON
:::

```ts
const settings = preprocess(
  (v) => (typeof v === 'string' ? JSON.parse(v) : v),
  object({ theme: oneOf(['light', 'dark']) }),
);
```

## @t(see)

::: ru
- [coerce](~/schemas/coerce) — готовые приведения типов
- [transform](~/schemas/transform) — преобразовать результат после проверки
:::

::: en
- [coerce](~/schemas/coerce) — built-in type coercion
- [transform](~/schemas/transform) — transform the result after validation
:::

::: zh
- [coerce](~/schemas/coerce)：内置的类型转换
- [transform](~/schemas/transform)：在校验后转换结果
:::
