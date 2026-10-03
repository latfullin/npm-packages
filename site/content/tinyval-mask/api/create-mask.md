::: ru
Создаёт маску по шаблону. Строку или массив можно передавать прямо в [`mask`](~/api/mask) и [`attach`](~/api/attach) — `createMask` нужен для своих токенов, подготовки ввода и своего значения без маски.
:::

::: en
Creates a mask from a pattern. A string or an array can be passed straight to [`mask`](~/api/mask) and [`attach`](~/api/attach) — `createMask` is for custom tokens, input preparation and a custom unmasked value.
:::

::: zh
根据模板创建掩码。字符串或数组可以直接传给 [`mask`](~/api/mask) 和 [`attach`](~/api/attach) —— `createMask` 用于自定义令牌、预处理输入以及自定义去掉掩码后的值。
:::

## @t(signature)

```ts
function createMask(options: MaskOptions | string | string[]): Mask

interface MaskOptions {
  pattern: string | string[] | ((input: string) => string);
  tokens?: Record<string, { pattern: RegExp; transform?: 'upper' | 'lower' | ((char: string) => string) }>;
  prepare?: (input: string) => string;
  allow?: (raw: string, char: string) => boolean;
  validate?: (result: MaskResult) => boolean;
  output?: (result: MaskResult) => string;
}
```

::: ru
| Опция | Описание |
| --- | --- |
| `pattern` | Шаблон, массив шаблонов (берётся первый подходящий) или функция от ввода — см. [Шаблоны](~/guide/patterns) |
| `tokens` | Свои токены в дополнение к `9`, `a`, `*` |
| `prepare` | Подготовка ввода перед форматированием — например, `8` → `+7` в начале телефона |
| `allow` | Можно ли принять символ, учитывая уже введённое (`raw`). Так маски дат не пропускают 32-е число |
| `validate` | Правильно ли заполненное значение — результат попадает в `valid` и [`isValid`](~/api/mask). Вызывается, только когда маска заполнена |
| `output` | Значение без маски. По умолчанию — введённые символы без литералов (`result.raw`) |

`MaskResult` — `{ value, raw, complete, slots, overflow }`: отформатированное значение, введённые символы, заполнена ли маска, позиции введённых символов, остались ли лишние символы.
:::

::: en
| Option | Description |
| --- | --- |
| `pattern` | A pattern, an array of patterns (the first fitting one is used) or a function of the input — see [Patterns](~/guide/patterns) |
| `tokens` | Custom tokens in addition to `9`, `a`, `*` |
| `prepare` | Input preparation before formatting — e.g. `8` → `+7` at the start of a phone |
| `allow` | Whether a character can be accepted given what's already typed (`raw`). That's how date masks reject day 32 |
| `validate` | Whether the filled value is correct — the result goes to `valid` and [`isValid`](~/api/mask). Called only when the mask is filled |
| `output` | The unmasked value. Defaults to the typed characters without literals (`result.raw`) |

`MaskResult` is `{ value, raw, complete, slots, overflow }`: the formatted value, the typed characters, whether the mask is filled, positions of typed characters, whether extra characters were left.
:::

::: zh
| 选项 | 说明 |
| --- | --- |
| `pattern` | 模板、模板数组（使用第一个合适的）或基于输入的函数 —— 见 [模板](~/guide/patterns) |
| `tokens` | 在 `9`、`a`、`*` 之外的自定义令牌 |
| `prepare` | 格式化前预处理输入 —— 例如把电话开头的 `8` 变为 `+7` |
| `allow` | 根据已输入内容（`raw`）判断能否接受该字符。日期掩码就是这样拒绝 32 日的 |
| `validate` | 填写完整的值是否正确 —— 结果写入 `valid` 和 [`isValid`](~/api/mask)。只在掩码填写完整时调用 |
| `output` | 去掉掩码后的值。默认为不含字面量的已输入字符（`result.raw`） |

`MaskResult` 为 `{ value, raw, complete, slots, overflow }`：格式化后的值、已输入字符、掩码是否填写完整、已输入字符的位置、是否有多余字符。
:::

## @t(example)

```ts
// order number: 2 letters + 6 digits, stored without the dash
const orderNumber = createMask({
  pattern: 'LL-999999',
  tokens: { L: { pattern: /[a-z]/i, transform: 'upper' } },
});

mask('ab123456', orderNumber);   // 'AB-123456'
unmask('AB-123456', orderNumber); // 'AB123456'
```

## @t(see)

::: ru
- [Шаблоны](~/guide/patterns)
- [Готовые маски](~/api/presets)
:::

::: en
- [Patterns](~/guide/patterns)
- [Ready-made masks](~/api/presets)
:::

::: zh
- [模板](~/guide/patterns)
- [预设掩码](~/api/presets)
:::
