::: ru
Меняет тексты ошибок по умолчанию для всего приложения. Можно передать всю локализацию или только отдельные сообщения.
:::

::: en
Changes the default error texts for the whole app. Pass a whole locale or just some messages.
:::

::: zh
修改整个应用的默认错误文本。可以传入整个语言包，也可以只传入部分信息。
:::

## @t(signature)

```ts
function setMessages(messages: Record<string, Message>): void
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `messages` | `Record<string, Message>` | Код ошибки → текст или функция `(params) => string`. Остальные сообщения не меняются |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `messages` | `Record<string, Message>` | Error code → text or a function `(params) => string`. Other messages stay unchanged |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `messages` | `Record<string, Message>` | 错误代码 → 文本或函数 `(params) => string`。其他信息保持不变 |
:::

## @t(notes)

::: ru
- Действует глобально — вызовите один раз при старте приложения.
- Сообщение, переданное прямо в правило (`minLength(3, '...')`), важнее глобального.
- Можно добавлять сообщения для своих кодов ошибок — см. [Свои правила и схемы](~/guide/custom-rules).
- Список кодов — в разделе [Сообщения и локализация](~/guide/messages#все-коды-ошибок).
:::

::: en
- It is global — call it once on startup.
- A message passed to a rule (`minLength(3, '...')`) takes precedence over the global one.
- You can add messages for your own error codes — see [Custom rules & schemas](~/guide/custom-rules).
- The list of codes is in [Messages & i18n](~/guide/messages#all-error-codes).
:::

::: zh
- 全局生效 —— 在应用启动时调用一次即可。
- 直接传给规则的信息（`minLength(3, '...')`）优先于全局信息。
- 可以为自定义错误代码添加信息 —— 见 [自定义规则与 Schema](~/guide/custom-rules)。
- 错误代码列表见 [错误信息与国际化](~/guide/messages#全部错误代码)。
:::

## @t(examples)

::: ru
### Русская локализация

```ts
import { setMessages } from 'tinyval';
import ru from 'tinyval/locales/ru';

setMessages(ru);
```

### Отдельные тексты

```ts
setMessages({
  required: 'Заполните поле',
  minLength: (p) => `Минимум ${p.min} символов`,
});
```
:::

::: en
### Russian locale

```ts
import { setMessages } from 'tinyval';
import ru from 'tinyval/locales/ru';

setMessages(ru);
```

### Some texts

```ts
setMessages({
  required: 'Please fill in',
  minLength: (p) => `At least ${p.min} characters`,
});
```
:::

::: zh
### 中文语言包

```ts
import { setMessages } from 'tinyval';
import zh from 'tinyval/locales/zh';

setMessages(zh);
```

### 部分文本

```ts
setMessages({
  required: '请填写此项',
  minLength: (p) => `至少 ${p.min} 个字符`,
});
```
:::

## @t(see)

::: ru
- [Сообщения и локализация](~/guide/messages) — все коды и параметры
:::

::: en
- [Messages & i18n](~/guide/messages) — all codes and parameters
:::

::: zh
- [错误信息与国际化](~/guide/messages)：全部代码和参数
:::
