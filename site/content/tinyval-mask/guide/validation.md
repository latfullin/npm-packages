::: ru
Маска отвечает за **вид** значения, валидация — за **правильность**. Маска не даст ввести букву в телефон, но не знает, что номер не дописан или что у ИНН неверная контрольная сумма.
:::

::: en
A mask is about how a value **looks**, validation is about whether it's **correct**. A mask won't let a letter into a phone number, but it doesn't know the number is unfinished or that a tax ID checksum is wrong.
:::

::: zh
掩码负责值的**外观**，校验负责值是否**正确**。掩码不会让字母进入电话号码，但它不知道号码是否填写完整，也不知道税号的校验位是否正确。
:::

::: ru
## Проверить, что маска заполнена

[`isComplete`](~/api/mask) — все обязательные позиции заполнены. [`isValid`](~/api/mask) — заполнено и правильно по смыслу (что именно проверяется — в [Готовых масках](~/api/presets#что-проверяет-valid)):
:::

::: en
## Check that the mask is filled

[`isComplete`](~/api/mask) — all required positions are filled. [`isValid`](~/api/mask) — filled and correct (what exactly is checked — in [Ready-made masks](~/api/presets#what-valid-checks)):
:::

::: zh
## 检查掩码是否填写完整

[`isComplete`](~/api/mask) —— 所有必填位置都已填写。[`isValid`](~/api/mask) —— 已填写且正确（具体检查内容见 [预设掩码](~/api/presets)）：
:::

```ts
isComplete('+7 (999) 123-45', phone());    // false
isComplete('+7 (999) 123-45-67', phone()); // true

// filled and correct
isValid('31.02.2026', date());              // false — no such date
isValid('4111 1111 1111 1112', card());     // false — wrong check digit
```

::: ru
## Со схемой tinyval

Снимите маску в [`preprocess`](@/tinyval/schemas/preprocess) — дальше проверяется и попадает в `data` чистое значение:
:::

::: en
## With a tinyval schema

Remove the mask in [`preprocess`](@/tinyval/schemas/preprocess) — then the clean value is validated and goes to `data`:
:::

::: zh
## 与 tinyval Schema 一起使用

在 [`preprocess`](@/tinyval/schemas/preprocess) 中去掉掩码 —— 之后校验并写入 `data` 的就是纯值：
:::

```ts
import { validate, object, string, pipe, preprocess, length, pattern, coerce } from 'tinyval';
import { unmask, isComplete } from 'tinyval-mask';
import { phone, card, money } from 'tinyval-mask/presets';

const phoneMask = phone();
const cardMask = card();
const moneyMask = money();

// the mask is removed first, then the clean value is validated
const unmasked = (m: Parameters<typeof unmask>[1]) => (v: unknown) => (v === '' || v == null ? v : unmask(String(v), m));

const Order = object({
  phone: preprocess(unmasked(phoneMask), pipe(string(), length(11))),
  card: preprocess(unmasked(cardMask), pipe(string(), pattern(/^\d{16,19}$/))),
  amount: preprocess(unmasked(moneyMask), coerce.number()),
});

validate(Order, { phone: '+7 (999) 123-45-67', card: '4276 1234 5678 9012', amount: '1 500,50' }).data;
// { phone: '79991234567', card: '4276123456789012', amount: 1500.5 }
```

::: ru
- Пустое значение остаётся пустым — работает правило [пустых значений](@/tinyval/guide/empty-values) и `optional`.
- То же на сервере: маски — чистые функции, поэтому `unmask` нормализует телефоны, пришедшие в любом формате.
:::

::: en
- An empty value stays empty — the [empty values](@/tinyval/guide/empty-values) rule and `optional` work.
- The same works on the server: masks are pure functions, so `unmask` normalizes phones sent in any format.
:::

::: zh
- 空值保持为空 —— [空值](@/tinyval/guide/empty-values)规则和 `optional` 仍然生效。
- 在服务端同样适用：掩码是纯函数，因此 `unmask` 可以规范化以任意格式提交的电话号码。
:::

## @t(see)

::: ru
- [preprocess](@/tinyval/schemas/preprocess)
- [mask, unmask, isComplete](~/api/mask)
:::

::: en
- [preprocess](@/tinyval/schemas/preprocess)
- [mask, unmask, isComplete](~/api/mask)
:::

::: zh
- [preprocess](@/tinyval/schemas/preprocess)
- [mask, unmask, isComplete](~/api/mask)
:::
