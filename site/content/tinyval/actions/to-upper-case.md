::: ru
Переводит строку в верхний регистр. Результат попадает в `data`.
:::

::: en
Converts the string to upper case. The result goes to `data`.
:::

::: zh
把字符串转换为大写。结果写入 `data`。
:::

## @t(signature)

```ts
function toUpperCase(): Action<string>
```

## @t(example)

::: ru
### Промокод
:::

::: en
### Promo code
:::

::: zh
### 优惠码
:::

```ts
pipe(string(), trim(), toUpperCase(), pattern(/^[A-Z0-9]{6,10}$/))
```

## @t(see)

- [toLowerCase](~/actions/to-lower-case)
- [trim](~/actions/trim)
