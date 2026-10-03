::: ru
Массив фиксированной длины, у каждой позиции своя схема.
:::

::: en
A fixed-length array with its own schema for each position.
:::

::: zh
固定长度的数组，每个位置都有自己的 Schema。
:::

## @t(signature)

```ts
function tuple<const T extends readonly Schema[]>(items: T, msg?: Message): Schema<[...]>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `items` | `Schema[]` | Схемы для каждой позиции |
| `msg` | `Message` | Своё сообщение для всех ошибок самого массива |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `items` | `Schema[]` | A schema for each position |
| `msg` | `Message` | Custom message for all errors of the array itself |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `items` | `Schema[]` | 每个位置的 Schema |
| `msg` | `Message` | 数组本身所有错误的自定义信息 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое | Required |
| `array` | Не массив | Must be an array |
| `items` | Другое число элементов | Must have exactly &#123;length&#125; &#123;length&#124;item&#124;items&#125; |
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty | Required |
| `array` | Not an array | Must be an array |
| `items` | Wrong number of items | Must have exactly &#123;length&#125; &#123;length&#124;item&#124;items&#125; |
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空 | Required |
| `array` | 不是数组 | Must be an array |
| `items` | 元素数量不符 | Must have exactly &#123;length&#125; &#123;length&#124;item&#124;items&#125; |
:::

## @t(examples)

::: ru
### Координаты
:::

::: en
### Coordinates
:::

::: zh
### 坐标
:::

```ts
const point = tuple([pipe(number(), min(-90), max(90)), pipe(number(), min(-180), max(180))]);
// [number, number]

validate(point, [55.75, 37.62]).valid; // true
validate(point, [55.75]).errors;       // { '': 'Must have exactly 2 items' }
validate(point, [100, 0]).errors;      // { 0: 'Must be at most 90' }
```

::: ru
### Диапазон дат
:::

::: en
### Date range
:::

::: zh
### 日期范围
:::

```ts
const range = tuple([coerce.date(), coerce.date()]); // [Date, Date]
```

## @t(see)

::: ru
- [array](~/schemas/array) — массив любой длины с одной схемой
:::

::: en
- [array](~/schemas/array) — an array of any length with one schema
:::

::: zh
- [array](~/schemas/array)：任意长度、使用同一个 Schema 的数组
:::
