::: ru
Переводит строку в нижний регистр. Результат попадает в `data`.
:::

::: en
Converts the string to lower case. The result goes to `data`.
:::

::: zh
把字符串转换为小写。结果写入 `data`。
:::

## @t(signature)

```ts
function toLowerCase(): Action<string>
```

## @t(example)

::: ru
### Email и логин
:::

::: en
### Email and username
:::

::: zh
### 邮箱和用户名
:::

```ts
const Login = object({
  email: pipe(string(), trim(), toLowerCase(), email()),
  username: pipe(string(), toLowerCase()),
});
```

## @t(see)

- [toUpperCase](~/actions/to-upper-case)
- [trim](~/actions/trim)
