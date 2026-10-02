::: ru
У каждой ошибки есть **код** (например, `minLength`) и **сообщение**. Сообщение можно задать для конкретного правила, для всего приложения или подключить готовую локализацию.

## Сообщение для конкретного правила

Последний аргумент любой схемы и правила — сообщение:

```ts
string('Введите имя')
pipe(string(), minLength(8, 'Пароль слишком короткий'))
```

Для схем (`string()`, `object()`…) сообщение заменяет **все** их ошибки — и «обязательное поле», и «неверный тип».

## Параметры в тексте

В тексте можно использовать параметры правила в фигурных скобках:

```ts
minLength(3, 'Минимум {min} символа')   // → «Минимум 3 символа»
oneOf(['a', 'b'], 'Выберите: {options}') // → «Выберите: a, b»
```

Если нужна логика (например, склонение), передайте функцию — она получит параметры:

```ts
const plural = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? 'символ' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'символа' : 'символов');

minLength(5, (p) => `Минимум ${p.min} ${plural(p.min as number)}`) // → «Минимум 5 символов»
```

## Сообщения для всего приложения

[`setMessages`](~/api/set-messages) меняет тексты по умолчанию. Вызовите один раз при старте приложения:

```ts
import { setMessages } from 'tinyval';
import ru from 'tinyval/locales/ru';

setMessages(ru);                             // всё на русском
setMessages({ required: 'Заполните поле' });  // переопределить отдельные тексты
```

## Язык для одного вызова

`setMessages` действует на всё приложение. На сервере, где у каждого запроса свой язык, передайте сообщения в сам вызов — они не затронут другие запросы:

```ts
import ru from 'tinyval/locales/ru';
import en from 'tinyval/locales/en';

const locales = { ru, en };

app.post('/users', (req, res) => {
  const lang = req.acceptsLanguages('ru', 'en') || 'en';
  const result = validate(CreateUser, req.body, { messages: locales[lang] });
});
```

Сообщения вызова можно передать частично — недостающие возьмутся из `setMessages`.

## Название поля — `{label}`

В любом сообщении доступен параметр `{label}` — как `:attribute` в Laravel. По умолчанию это имя поля (`email`), а своё название задаёт [`label`](~/schemas/label) или опция `labels`:

```ts
const Signup = object({
  email: label(pipe(string(), email()), 'Почта'),
  password: label(pipe(string(), minLength(8)), 'Пароль'),
});

setMessages({ required: 'Поле «{label}» обязательно', minLength: '{label}: минимум {min} символов' });

validate(Signup, { password: '123' }).errors;
// { email: 'Поле «Почта» обязательно', password: 'Пароль: минимум 8 символов' }
```

## Перевод на клиенте — params

Если сервер не знает язык пользователя, можно отдать клиенту коды и параметры ошибок, а текст собрать на фронтенде:

```ts
validate(Signup, body).issues;
// [{ code: 'minLength', params: { min: 8 }, path: ['password'], message: '...' }]
```

## Локализации

| Импорт | Язык |
| --- | --- |
| `tinyval/locales/en` | Английский (по умолчанию) |
| `tinyval/locales/ru` | Русский |
| `tinyval/locales/zh` | Китайский (упрощённый) |

`setMessages(en)` возвращает английские тексты.

Чтобы поменять тексты под себя, скопируйте lang-файл в проект командой `npx tinyval lang ru` — см. [Свой lang-файл](~/guide/custom-lang).

## Все коды ошибок

| Код | Где возникает | По умолчанию (en) | В `tinyval/locales/ru` |
| --- | --- | --- | --- |
| `invalid` | [`check`](~/actions/check), [`checkAsync`](~/actions/check-async) | Invalid value | Некорректное значение |
| `required` | пустое значение в любой схеме | Required | Обязательное поле |
| `string` | [`string`](~/schemas/string) | Must be a string | Должно быть строкой |
| `number` | [`number`](~/schemas/number) | Must be a number | Должно быть числом |
| `boolean` | [`boolean`](~/schemas/boolean) | Must be a boolean | Должно быть логическим значением |
| `date` | [`date`](~/schemas/date) | Must be a valid date | Некорректная дата |
| `object` | [`object`](~/schemas/object) | Must be an object | Должно быть объектом |
| `array` | [`array`](~/schemas/array) | Must be an array | Должно быть списком |
| `literal` | [`literal`](~/schemas/literal) | Must be &#123;expected&#125; | Должно быть &#123;expected&#125; |
| `oneOf` | [`oneOf`](~/schemas/one-of) | Must be one of: &#123;options&#125; | Допустимые значения: &#123;options&#125; |
| `union` | [`union`](~/schemas/union) | Does not match any allowed type | Значение не подходит ни под один из вариантов |
| `variant` | [`variant`](~/schemas/variant) | Unknown type, expected one of: &#123;options&#125; | Неизвестный тип, допустимые: &#123;options&#125; |
| `depth` | [`lazy`](~/schemas/lazy) | Too deeply nested (max &#123;max&#125;) | Слишком глубокая вложенность (максимум &#123;max&#125;) |
| `unknownKey` | [`object`](~/schemas/object) с `unknown: 'strict'` | Unknown field | Неизвестное поле |
| `minLength` | [`minLength`](~/actions/min-length) | Must be at least &#123;min&#125; long | Минимальная длина — &#123;min&#125; |
| `maxLength` | [`maxLength`](~/actions/max-length) | Must be at most &#123;max&#125; long | Максимальная длина — &#123;max&#125; |
| `length` | [`length`](~/actions/length) | Must be exactly &#123;length&#125; long | Длина должна быть &#123;length&#125; |
| `min` | [`min`](~/actions/min) | Must be at least &#123;min&#125; | Не меньше &#123;min&#125; |
| `max` | [`max`](~/actions/max) | Must be at most &#123;max&#125; | Не больше &#123;max&#125; |
| `integer` | [`integer`](~/actions/integer) | Must be an integer | Должно быть целым числом |
| `pattern` | [`pattern`](~/actions/pattern) | Invalid format | Неверный формат |
| `email` | [`email`](~/actions/email) | Invalid email | Некорректный email |
| `sameAs` | [`sameAs`](~/actions/same-as) | Must match &#123;field&#125; | Значения не совпадают |

Своё сообщение с параметрами, которых нет в таблице, тоже работает — неизвестный `{параметр}` остаётся в тексте как есть.
:::

::: en
Every error has a **code** (e.g. `minLength`) and a **message**. You can set the message for a single rule, for the whole app, or load a ready-made locale.

## Message for a single rule

The last argument of every schema and rule is the message:

```ts
string('Please enter your name')
pipe(string(), minLength(8, 'Password is too short'))
```

For schemas (`string()`, `object()`…) the message replaces **all** their errors — both "required" and "wrong type".

## Parameters

Use rule parameters in curly braces:

```ts
minLength(3, 'At least {min} characters')  // → "At least 3 characters"
oneOf(['a', 'b'], 'Choose: {options}')       // → "Choose: a, b"
```

If you need logic (e.g. plurals), pass a function — it receives the parameters:

```ts
minLength(5, (p) => `At least ${p.min} character${p.min === 1 ? '' : 's'}`)
```

## Messages for the whole app

[`setMessages`](~/api/set-messages) changes the default texts. Call it once on startup:

```ts
import { setMessages } from 'tinyval';
import ru from 'tinyval/locales/ru';

setMessages(ru);                               // everything in Russian
setMessages({ required: 'Please fill in' }); // override some texts
```

## Language per call

`setMessages` applies to the whole app. On a server where every request has its own language, pass the messages to the call itself — other requests are not affected:

```ts
import ru from 'tinyval/locales/ru';
import en from 'tinyval/locales/en';

const locales = { ru, en };

app.post('/users', (req, res) => {
  const lang = req.acceptsLanguages('ru', 'en') || 'en';
  const result = validate(CreateUser, req.body, { messages: locales[lang] });
});
```

Call messages can be partial — missing ones come from `setMessages`.

## Field name — `{label}`

Every message can use the `{label}` parameter — like `:attribute` in Laravel. By default it is the field name (`email`); a custom name is set with [`label`](~/schemas/label) or the `labels` option:

```ts
const Signup = object({
  email: label(pipe(string(), email()), 'Email address'),
  password: label(pipe(string(), minLength(8)), 'Password'),
});

setMessages({ required: '{label} is required', minLength: '{label} must be at least {min} characters' });

validate(Signup, { password: '123' }).errors;
// { email: 'Email address is required', password: 'Password must be at least 8 characters' }
```

## Translating on the client — params

If the server doesn't know the user's language, send the error codes and parameters to the client and build the text on the frontend:

```ts
validate(Signup, body).issues;
// [{ code: 'minLength', params: { min: 8 }, path: ['password'], message: '...' }]
```

## Locales

| Import | Language |
| --- | --- |
| `tinyval/locales/en` | English (default) |
| `tinyval/locales/ru` | Russian |
| `tinyval/locales/zh` | Simplified Chinese |

`setMessages(en)` brings back the English texts.

To customize the texts, copy a lang file into your project with `npx tinyval lang en` — see [Custom lang file](~/guide/custom-lang).

## All error codes

| Code | Raised by | Message (en) |
| --- | --- | --- |
| `invalid` | [`check`](~/actions/check), [`checkAsync`](~/actions/check-async) | Invalid value |
| `required` | an empty value in any schema | Required |
| `string` | [`string`](~/schemas/string) | Must be a string |
| `number` | [`number`](~/schemas/number) | Must be a number |
| `boolean` | [`boolean`](~/schemas/boolean) | Must be a boolean |
| `date` | [`date`](~/schemas/date) | Must be a valid date |
| `object` | [`object`](~/schemas/object) | Must be an object |
| `array` | [`array`](~/schemas/array) | Must be an array |
| `literal` | [`literal`](~/schemas/literal) | Must be &#123;expected&#125; |
| `oneOf` | [`oneOf`](~/schemas/one-of) | Must be one of: &#123;options&#125; |
| `union` | [`union`](~/schemas/union) | Does not match any allowed type |
| `variant` | [`variant`](~/schemas/variant) | Unknown type, expected one of: &#123;options&#125; |
| `depth` | [`lazy`](~/schemas/lazy) | Too deeply nested (max &#123;max&#125;) |
| `unknownKey` | [`object`](~/schemas/object) with `unknown: 'strict'` | Unknown field |
| `minLength` | [`minLength`](~/actions/min-length) | Must be at least &#123;min&#125; long |
| `maxLength` | [`maxLength`](~/actions/max-length) | Must be at most &#123;max&#125; long |
| `length` | [`length`](~/actions/length) | Must be exactly &#123;length&#125; long |
| `min` | [`min`](~/actions/min) | Must be at least &#123;min&#125; |
| `max` | [`max`](~/actions/max) | Must be at most &#123;max&#125; |
| `integer` | [`integer`](~/actions/integer) | Must be an integer |
| `pattern` | [`pattern`](~/actions/pattern) | Invalid format |
| `email` | [`email`](~/actions/email) | Invalid email |
| `sameAs` | [`sameAs`](~/actions/same-as) | Must match &#123;field&#125; |

Unknown `{params}` in your own messages stay in the text as is.
:::

::: zh
每个错误都有一个**代码**（例如 `minLength`）和一条**信息**。可以为单个规则设置信息，也可以为整个应用设置，或者加载现成的语言包。

## 单个规则的信息

每个 Schema 和规则的最后一个参数都是信息：

```ts
string('请输入姓名')
pipe(string(), minLength(8, '密码太短'))
```

对于 Schema（`string()`、`object()`…），信息会替换它的**所有**错误 —— 包括“必填”和“类型错误”。

## 信息中的参数

可以在花括号中使用规则参数：

```ts
minLength(3, '至少 {min} 个字符')     // → “至少 3 个字符”
oneOf(['a', 'b'], '请选择：{options}') // → “请选择：a, b”
```

如果需要逻辑处理，可以传入函数 —— 它会接收参数：

```ts
minLength(5, (p) => `至少需要 ${p.min} 个字符`)
```

## 整个应用的信息

[`setMessages`](~/api/set-messages) 修改默认文本。在应用启动时调用一次：

```ts
import { setMessages } from 'tinyval';
import zh from 'tinyval/locales/zh';

setMessages(zh);                         // 全部使用中文
setMessages({ required: '请填写此项' }); // 覆盖部分文本
```

## 单次调用的语言

`setMessages` 对整个应用生效。在服务端，每个请求可能使用不同的语言，此时请把信息传给调用本身 —— 不会影响其他请求：

```ts
import zh from 'tinyval/locales/zh';
import en from 'tinyval/locales/en';

const locales = { zh, en };

app.post('/users', (req, res) => {
  const lang = req.acceptsLanguages('zh', 'en') || 'en';
  const result = validate(CreateUser, req.body, { messages: locales[lang] });
});
```

调用时的信息可以只传一部分 —— 缺少的取自 `setMessages`。

## 字段名称 —— `{label}`

所有信息都可以使用 `{label}` 参数 —— 类似 Laravel 的 `:attribute`。默认是字段名（`email`），可以通过 [`label`](~/schemas/label) 或 `labels` 选项设置自定义名称：

```ts
const Signup = object({
  email: label(pipe(string(), email()), '邮箱'),
  password: label(pipe(string(), minLength(8)), '密码'),
});

setMessages({ required: '{label}为必填项', minLength: '{label}至少需要 {min} 个字符' });

validate(Signup, { password: '123' }).errors;
// { email: '邮箱为必填项', password: '密码至少需要 8 个字符' }
```

## 在客户端翻译 —— params

如果服务端不知道用户的语言，可以把错误代码和参数发送给客户端，在前端生成文本：

```ts
validate(Signup, body).issues;
// [{ code: 'minLength', params: { min: 8 }, path: ['password'], message: '...' }]
```

## 语言包

| 导入 | 语言 |
| --- | --- |
| `tinyval/locales/en` | 英语（默认） |
| `tinyval/locales/ru` | 俄语 |
| `tinyval/locales/zh` | 简体中文 |

`setMessages(en)` 可以恢复英文文本。

如需自定义文本，可以用 `npx tinyval lang zh` 把语言文件复制到项目中 —— 见 [自定义语言文件](~/guide/custom-lang)。

## 全部错误代码

| 代码 | 来源 | 英文（默认） | `tinyval/locales/zh` |
| --- | --- | --- | --- |
| `invalid` | [`check`](~/actions/check)、[`checkAsync`](~/actions/check-async) | Invalid value | 无效的值 |
| `required` | 任意 Schema 中的空值 | Required | 此项为必填项 |
| `string` | [`string`](~/schemas/string) | Must be a string | 必须是字符串 |
| `number` | [`number`](~/schemas/number) | Must be a number | 必须是数字 |
| `boolean` | [`boolean`](~/schemas/boolean) | Must be a boolean | 必须是布尔值 |
| `date` | [`date`](~/schemas/date) | Must be a valid date | 必须是有效的日期 |
| `object` | [`object`](~/schemas/object) | Must be an object | 必须是对象 |
| `array` | [`array`](~/schemas/array) | Must be an array | 必须是数组 |
| `literal` | [`literal`](~/schemas/literal) | Must be &#123;expected&#125; | 必须是 &#123;expected&#125; |
| `oneOf` | [`oneOf`](~/schemas/one-of) | Must be one of: &#123;options&#125; | 必须是以下值之一：&#123;options&#125; |
| `union` | [`union`](~/schemas/union) | Does not match any allowed type | 不符合任何允许的类型 |
| `variant` | [`variant`](~/schemas/variant) | Unknown type, expected one of: &#123;options&#125; | 未知类型，允许的值：&#123;options&#125; |
| `depth` | [`lazy`](~/schemas/lazy) | Too deeply nested (max &#123;max&#125;) | 嵌套层级过深（最多 &#123;max&#125;） |
| `unknownKey` | 使用 `unknown: 'strict'` 的 [`object`](~/schemas/object) | Unknown field | 未知字段 |
| `minLength` | [`minLength`](~/actions/min-length) | Must be at least &#123;min&#125; long | 长度不能少于 &#123;min&#125; |
| `maxLength` | [`maxLength`](~/actions/max-length) | Must be at most &#123;max&#125; long | 长度不能超过 &#123;max&#125; |
| `length` | [`length`](~/actions/length) | Must be exactly &#123;length&#125; long | 长度必须为 &#123;length&#125; |
| `min` | [`min`](~/actions/min) | Must be at least &#123;min&#125; | 不能小于 &#123;min&#125; |
| `max` | [`max`](~/actions/max) | Must be at most &#123;max&#125; | 不能大于 &#123;max&#125; |
| `integer` | [`integer`](~/actions/integer) | Must be an integer | 必须是整数 |
| `pattern` | [`pattern`](~/actions/pattern) | Invalid format | 格式无效 |
| `email` | [`email`](~/actions/email) | Invalid email | 邮箱地址无效 |
| `sameAs` | [`sameAs`](~/actions/same-as) | Must match &#123;field&#125; | 必须与 &#123;field&#125; 一致 |

自定义信息中的未知 `{参数}` 会原样保留在文本中。
:::

## @t(see)

::: ru
- [setMessages](~/api/set-messages)
- [ValidationError](~/api/validation-error) — как сообщения попадают в исключение
- [Свои правила и схемы](~/guide/custom-rules) — свои коды ошибок
:::

::: en
- [setMessages](~/api/set-messages)
- [ValidationError](~/api/validation-error) — how messages get into the exception
- [Custom rules & schemas](~/guide/custom-rules) — your own error codes
:::

::: zh
- [setMessages](~/api/set-messages)
- [ValidationError](~/api/validation-error)：信息如何进入异常
- [自定义规则与 Schema](~/guide/custom-rules)：自定义错误代码
:::
