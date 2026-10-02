::: ru
Преобразует результат схемы и может **изменить его тип**. Функция вызывается, только если проверка прошла.
:::

::: en
Transforms the result of a schema and can **change its type**. The function runs only if validation passed.
:::

::: zh
转换 Schema 的结果，并且可以**改变它的类型**。函数只在校验通过后执行。
:::

## @t(signature)

```ts
function transform<T, U>(schema: Schema<T>, fn: (value: T) => U): Schema<U>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `schema` | `Schema<T>` | Схема, результат которой преобразуется |
| `fn` | `(value: T) => U` | Функция преобразования |

## Отличие от преобразований в pipe

[`trim`](~/actions/trim), [`toLowerCase`](~/actions/to-lower-case) и другие действия в [`pipe`](~/actions/pipe) не меняют тип. `transform` — меняет: строка может стать массивом, числом, объектом.

Исключение внутри `fn` не превращается в ошибку валидации, а пробрасывается дальше. Сначала проверьте значение правилами, потом преобразуйте.
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `schema` | `Schema<T>` | The schema whose result is transformed |
| `fn` | `(value: T) => U` | The transform function |

## Difference from transforms in pipe

[`trim`](~/actions/trim), [`toLowerCase`](~/actions/to-lower-case) and other actions in [`pipe`](~/actions/pipe) keep the type. `transform` changes it: a string can become an array, a number, an object.

An exception inside `fn` is not turned into a validation error, it is rethrown. Validate the value with rules first, then transform it.
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | `Schema<T>` | 其结果将被转换的 Schema |
| `fn` | `(value: T) => U` | 转换函数 |

## 与 pipe 中转换的区别

[`pipe`](~/actions/pipe) 中的 [`trim`](~/actions/trim)、[`toLowerCase`](~/actions/to-lower-case) 等操作不改变类型。`transform` 会改变类型：字符串可以变成数组、数字或对象。

`fn` 中抛出的异常不会变成校验错误，而是继续向外抛出。请先用规则校验值，再进行转换。
:::

## @t(examples)

::: ru
### Строка через запятую в массив
:::

::: en
### Comma-separated string to array
:::

::: zh
### 逗号分隔的字符串转数组
:::

```ts
const ids = transform(pipe(string(), pattern(/^\d+(,\d+)*$/)), (s) => s.split(',').map(Number));

validate(ids, '1,2,3').data; // [1, 2, 3]
```

::: ru
### Рубли в копейки

```ts
const price = transform(pipe(coerce.number(), min(0)), (rub) => Math.round(rub * 100));
```
:::

::: en
### Dollars to cents

```ts
const price = transform(pipe(coerce.number(), min(0)), (usd) => Math.round(usd * 100));
```
:::

::: zh
### 元转为分

```ts
const price = transform(pipe(coerce.number(), min(0)), (yuan) => Math.round(yuan * 100));
```
:::

## @t(see)

::: ru
- [preprocess](~/schemas/preprocess) — подготовить значение до проверки
- [pipe](~/actions/pipe)
:::

::: en
- [preprocess](~/schemas/preprocess) — prepare the input before validation
- [pipe](~/actions/pipe)
:::

::: zh
- [preprocess](~/schemas/preprocess)：在校验前预处理输入
- [pipe](~/actions/pipe)
:::
