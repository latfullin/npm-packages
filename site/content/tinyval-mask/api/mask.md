::: ru
Чистые функции: работают без DOM — в браузере, на сервере, в тестах. Маску можно передать объектом или строкой-шаблоном.
:::

::: en
Pure functions: they work without the DOM — in the browser, on the server, in tests. The mask can be an object or a pattern string.
:::

::: zh
纯函数：无需 DOM 即可使用 —— 浏览器、服务端、测试中都可以。掩码可以是对象，也可以是模板字符串。
:::

## @t(signature)

```ts
function mask(value: string, mask: MaskInput): string
function unmask(value: string, mask: MaskInput): string
function isComplete(value: string, mask: MaskInput): boolean
function isValid(value: string, mask: MaskInput): boolean
```

::: ru
| Функция | Возвращает |
| --- | --- |
| `mask` | Отформатированное значение |
| `unmask` | Значение без маски — для данных и базы |
| `isComplete` | Заполнены ли все обязательные позиции |
| `isValid` | Заполнено и правильно по смыслу: дата существует, контрольная сумма сходится — см. [Готовые маски](~/api/presets#что-проверяет-valid) |

`null` и `undefined` считаются пустой строкой.
:::

::: en
| Function | Returns |
| --- | --- |
| `mask` | The formatted value |
| `unmask` | The unmasked value — for data and the database |
| `isComplete` | Whether all required positions are filled |
| `isValid` | Filled and correct: the date exists, the checksum matches — see [Ready-made masks](~/api/presets#what-valid-checks) |

`null` and `undefined` count as an empty string.
:::

::: zh
| 函数 | 返回值 |
| --- | --- |
| `mask` | 格式化后的值 |
| `unmask` | 去掉掩码后的值 —— 用于数据和数据库 |
| `isComplete` | 所有必填位置是否都已填写 |
| `isValid` | 已填写且正确：日期存在、校验和正确 —— 见 [预设掩码](~/api/presets) |

`null` 和 `undefined` 视为空字符串。
:::

## @t(examples)

```ts
import { mask, unmask, isComplete } from 'tinyval-mask';
import { phone } from 'tinyval-mask/presets';

mask('89991234567', phone());          // '+7 (999) 123-45-67'
unmask('+7 (999) 123-45-67', phone()); // '79991234567'
isComplete('+7 (999) 123', phone());   // false
isValid('4111 1111 1111 1112', card()); // false — wrong check digit

mask('20261002', '9999-99-99');        // '2026-10-02'
```

```ts
// server: normalize phones from any source
const normalized = users.map((u) => ({ ...u, phone: unmask(u.phone, phone()) }));
// '8 (999) 123-45-67', '+7 999 1234567', '9991234567' → '79991234567'
```

## @t(see)

::: ru
- [Маски и валидация](~/guide/validation)
- [attach](~/api/attach) — маска на поле ввода
:::

::: en
- [Masks & validation](~/guide/validation)
- [attach](~/api/attach) — a mask on an input field
:::

::: zh
- [掩码与校验](~/guide/validation)
- [attach](~/api/attach)：输入框上的掩码
:::
