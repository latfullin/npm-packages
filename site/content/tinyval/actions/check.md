::: ru
Своя синхронная проверка. Функция возвращает `true`, если значение валидно.
:::

::: en
A custom synchronous check. The function returns `true` if the value is valid.
:::

::: zh
自定义同步检查。值有效时函数返回 `true`。
:::

## @t(signature)

::: ru
```ts
function check<T>(fn: (value: T, info: Info) => boolean, msg?: Message): Action<T>

interface Info {
  parent: unknown; // объект, в котором лежит поле (исходные данные)
  root: unknown;   // все данные, переданные в validate
}
```
:::

::: en
```ts
function check<T>(fn: (value: T, info: Info) => boolean, msg?: Message): Action<T>

interface Info {
  parent: unknown; // the object containing the field (raw input)
  root: unknown;   // all data passed to validate
}
```
:::

::: zh
```ts
function check<T>(fn: (value: T, info: Info) => boolean, msg?: Message): Action<T>

interface Info {
  parent: unknown; // 包含该字段的对象（原始数据）
  root: unknown;   // 传给 validate 的全部数据
}
```
:::

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `fn` | `(value: T, info: Info) => boolean` | Проверка. `value` — уже проверенное и преобразованное значение |
| `msg` | `Message` | Своё сообщение об ошибке. Строка с `{параметрами}` или функция |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `fn` | `(value: T, info: Info) => boolean` | The check. `value` is already validated and transformed |
| `msg` | `Message` | Custom error message. A string with `{params}` or a function |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `fn` | `(value: T, info: Info) => boolean` | 检查函数。`value` 是已经校验并转换后的值 |
| `msg` | `Message` | 自定义错误信息。可以是带 `{参数}` 的字符串或函数 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `invalid` | `fn` вернула `false` | Invalid value |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `invalid` | `fn` returned `false` | Invalid value |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `invalid` | `fn` 返回 `false` | Invalid value |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
- Чтобы переиспользовать проверку, оберните её в функцию — см. [Свои правила и схемы](~/guide/custom-rules).
- Для запросов к базе или API — [`checkAsync`](~/actions/check-async).
- Исключение внутри `fn` не превращается в ошибку валидации, а пробрасывается.
:::

::: en
- To reuse a check, wrap it in a function — see [Custom rules & schemas](~/guide/custom-rules).
- For database or API calls use [`checkAsync`](~/actions/check-async).
- An exception inside `fn` is not turned into a validation error, it is rethrown.
:::

::: zh
- 要复用检查，请把它包装成函数 —— 见 [自定义规则与 Schema](~/guide/custom-rules)。
- 需要查询数据库或调用 API 时，请使用 [`checkAsync`](~/actions/check-async)。
- `fn` 中抛出的异常不会变成校验错误，而是继续向外抛出。
:::

## @t(examples)

::: ru
### Совершеннолетие

```ts
const adult = check<Date>((birth) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return birth <= d;
}, 'Только для 18+');

object({ birthday: pipe(coerce.date(), adult) });
```

### Зависимость от другого поля

```ts
object({
  delivery: oneOf(['pickup', 'courier']),
  address: optional(pipe(string(), check((v, { parent }) => parent.delivery === 'courier', 'Адрес нужен только для курьера'))),
});
```
:::

::: en
### Age 18+

```ts
const adult = check<Date>((birth) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return birth <= d;
}, '18+ only');

object({ birthday: pipe(coerce.date(), adult) });
```

### Depends on another field

```ts
object({
  delivery: oneOf(['pickup', 'courier']),
  address: optional(pipe(string(), check((v, { parent }) => parent.delivery === 'courier', 'Address is only for courier delivery'))),
});
```
:::

::: zh
### 年满 18 岁

```ts
const adult = check<Date>((birth) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return birth <= d;
}, '仅限 18 岁以上');

object({ birthday: pipe(coerce.date(), adult) });
```

### 依赖其他字段

```ts
object({
  delivery: oneOf(['pickup', 'courier']),
  address: optional(pipe(string(), check((v, { parent }) => parent.delivery === 'courier', '只有快递配送需要地址'))),
});
```
:::

## @t(see)

::: ru
- [checkAsync](~/actions/check-async)
- [Свои правила и схемы](~/guide/custom-rules)
- [sameAs](~/actions/same-as)
:::

::: en
- [checkAsync](~/actions/check-async)
- [Custom rules & schemas](~/guide/custom-rules)
- [sameAs](~/actions/same-as)
:::

::: zh
- [checkAsync](~/actions/check-async)
- [自定义规则与 Schema](~/guide/custom-rules)
- [sameAs](~/actions/same-as)
:::
