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

## Склонения: «3 символа», «5 символов»

Форма слова, зависящая от числа, пишется в фигурных скобках через `|`: сначала параметр, потом формы. Форма выбирается по правилам языка (`Intl.PluralRules`), язык берётся из ключа `$locale` в lang-файле:

```ts
setMessages({
  minLength: 'Минимум {min} {min|символ|символа|символов}',
});
// 1 символ, 2 символа, 5 символов, 21 символ
```

| Язык | Сколько форм | Пример |
| --- | --- | --- |
| Русский, украинский | 3: одна, несколько, много | `{n\|файл\|файла\|файлов}` |
| Английский, немецкий | 2: одна, много | `{n\|file\|files}` |
| Китайский, японский | 1 | `{n\|个}` или просто текст без форм |

Встроенные русская и английская локали уже используют склонения. Если форм указано меньше, чем нужно языку, берётся последняя.

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
| `oneOf` | [`oneOf`](~/schemas/one-of), [`enumOf`](~/schemas/enum-of) | Must be one of: &#123;options&#125; | Допустимые значения: &#123;options&#125; |
| `union` | [`union`](~/schemas/union) | Does not match any allowed type | Значение не подходит ни под один из вариантов |
| `variant` | [`variant`](~/schemas/variant) | Unknown type, expected one of: &#123;options&#125; | Неизвестный тип, допустимые: &#123;options&#125; |
| `depth` | [`lazy`](~/schemas/lazy) | Too deeply nested (max &#123;max&#125;) | Слишком глубокая вложенность (максимум &#123;max&#125;) |
| `unknownKey` | [`object`](~/schemas/object) с `unknown: 'strict'` | Unknown field | Неизвестное поле |
| `minLength` | [`minLength`](~/actions/min-length) у строки | Must be at least &#123;min&#125; &#123;min&#124;character&#124;characters&#125; long | Минимум &#123;min&#125; &#123;min&#124;символ&#124;символа&#124;символов&#125; |
| `maxLength` | [`maxLength`](~/actions/max-length) у строки | Must be at most &#123;max&#125; &#123;max&#124;character&#124;characters&#125; long | Максимум &#123;max&#125; &#123;max&#124;символ&#124;символа&#124;символов&#125; |
| `length` | [`length`](~/actions/length) у строки | Must be exactly &#123;length&#125; &#123;length&#124;character&#124;characters&#125; long | Должно быть &#123;length&#125; &#123;length&#124;символ&#124;символа&#124;символов&#125; |
| `min` | [`min`](~/actions/min) | Must be at least &#123;min&#125; | Не меньше &#123;min&#125; |
| `max` | [`max`](~/actions/max) | Must be at most &#123;max&#125; | Не больше &#123;max&#125; |
| `integer` | [`integer`](~/actions/integer) | Must be an integer | Должно быть целым числом |
| `pattern` | [`pattern`](~/actions/pattern) | Invalid format | Неверный формат |
| `email` | [`email`](~/actions/email) | Invalid email | Некорректный email |
| `minItems` | [`minLength`](~/actions/min-length) у массива | Must have at least &#123;min&#125; &#123;min&#124;item&#124;items&#125; | Минимум &#123;min&#125; &#123;min&#124;элемент&#124;элемента&#124;элементов&#125; |
| `maxItems` | [`maxLength`](~/actions/max-length) у массива | Must have at most &#123;max&#125; &#123;max&#124;item&#124;items&#125; | Максимум &#123;max&#125; &#123;max&#124;элемент&#124;элемента&#124;элементов&#125; |
| `items` | [`length`](~/actions/length) у массива, [`tuple`](~/schemas/tuple) | Must have exactly &#123;length&#125; &#123;length&#124;item&#124;items&#125; | Должно быть &#123;length&#125; &#123;length&#124;элемент&#124;элемента&#124;элементов&#125; |
| `between` | [`between`](~/actions/between) | Must be between &#123;min&#125; and &#123;max&#125; | От &#123;min&#125; до &#123;max&#125; |
| `url` | [`url`](~/actions/url) | Invalid URL | Некорректная ссылка |
| `uuid` | [`uuid`](~/actions/uuid) | Invalid UUID | Некорректный UUID |
| `startsWith` | [`startsWith`](~/actions/starts-with) | Must start with "&#123;value&#125;" | Должно начинаться с «&#123;value&#125;» |
| `endsWith` | [`endsWith`](~/actions/ends-with) | Must end with "&#123;value&#125;" | Должно заканчиваться на «&#123;value&#125;» |
| `includes` | [`includes`](~/actions/includes) | Must contain "&#123;value&#125;" | Должно содержать «&#123;value&#125;» |
| `unique` | [`unique`](~/actions/unique) | Must not contain duplicates | Значения не должны повторяться |
| `minDate` | [`minDate`](~/actions/min-date) | Must be on or after &#123;date&#125; | Не раньше &#123;date&#125; |
| `maxDate` | [`maxDate`](~/actions/max-date) | Must be on or before &#123;date&#125; | Не позже &#123;date&#125; |
| `after` | [`after`](~/actions/after) | Must be after &#123;field&#125; | Должно быть позже, чем &#123;field&#125; |
| `before` | [`before`](~/actions/before) | Must be before &#123;field&#125; | Должно быть раньше, чем &#123;field&#125; |
| `inn` | [`inn`](~/actions/inn) | Invalid INN | Некорректный ИНН |
| `snils` | [`snils`](~/actions/snils) | Invalid SNILS | Некорректный СНИЛС |
| `luhn` | [`luhn`](~/actions/luhn) | Invalid card number | Некорректный номер карты |
| `prohibited` | [`prohibitedIf`](~/conditions/prohibited-if) | Must be empty | Поле должно быть пустым |
| `file` | [`file`](~/schemas/file) | Must be a file | Выберите файл |
| `fileSize` | [`file`](~/schemas/file) — maxSize | File must be at most &#123;max&#125; | Файл не больше &#123;max&#125; |
| `fileType` | [`file`](~/schemas/file) — types | File type must be one of: &#123;types&#125; | Допустимые типы файлов: &#123;types&#125; |
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

## Plural forms: "1 character", "5 characters"

A word form that depends on a number is written in curly braces with `|`: the parameter first, then the forms. The form is chosen by the language rules (`Intl.PluralRules`); the language comes from the `$locale` key of the lang file:

```ts
setMessages({
  minLength: 'Must be at least {min} {min|character|characters} long',
});
// 1 character, 2 characters
```

| Language | Number of forms | Example |
| --- | --- | --- |
| Russian, Ukrainian | 3: one, few, many | `{n\|файл\|файла\|файлов}` |
| English, German | 2: one, other | `{n\|file\|files}` |
| Chinese, Japanese | 1 | `{n\|个}` or plain text without forms |

The built-in English and Russian locales already use plural forms. If fewer forms are given than the language needs, the last one is used.

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
| `oneOf` | [`oneOf`](~/schemas/one-of), [`enumOf`](~/schemas/enum-of) | Must be one of: &#123;options&#125; |
| `union` | [`union`](~/schemas/union) | Does not match any allowed type |
| `variant` | [`variant`](~/schemas/variant) | Unknown type, expected one of: &#123;options&#125; |
| `depth` | [`lazy`](~/schemas/lazy) | Too deeply nested (max &#123;max&#125;) |
| `unknownKey` | [`object`](~/schemas/object) with `unknown: 'strict'` | Unknown field |
| `minLength` | [`minLength`](~/actions/min-length) on a string | Must be at least &#123;min&#125; &#123;min&#124;character&#124;characters&#125; long |
| `maxLength` | [`maxLength`](~/actions/max-length) on a string | Must be at most &#123;max&#125; &#123;max&#124;character&#124;characters&#125; long |
| `length` | [`length`](~/actions/length) on a string | Must be exactly &#123;length&#125; &#123;length&#124;character&#124;characters&#125; long |
| `min` | [`min`](~/actions/min) | Must be at least &#123;min&#125; |
| `max` | [`max`](~/actions/max) | Must be at most &#123;max&#125; |
| `integer` | [`integer`](~/actions/integer) | Must be an integer |
| `pattern` | [`pattern`](~/actions/pattern) | Invalid format |
| `email` | [`email`](~/actions/email) | Invalid email |
| `minItems` | [`minLength`](~/actions/min-length) on an array | Must have at least &#123;min&#125; &#123;min&#124;item&#124;items&#125; |
| `maxItems` | [`maxLength`](~/actions/max-length) on an array | Must have at most &#123;max&#125; &#123;max&#124;item&#124;items&#125; |
| `items` | [`length`](~/actions/length) on an array, [`tuple`](~/schemas/tuple) | Must have exactly &#123;length&#125; &#123;length&#124;item&#124;items&#125; |
| `between` | [`between`](~/actions/between) | Must be between &#123;min&#125; and &#123;max&#125; |
| `url` | [`url`](~/actions/url) | Invalid URL |
| `uuid` | [`uuid`](~/actions/uuid) | Invalid UUID |
| `startsWith` | [`startsWith`](~/actions/starts-with) | Must start with "&#123;value&#125;" |
| `endsWith` | [`endsWith`](~/actions/ends-with) | Must end with "&#123;value&#125;" |
| `includes` | [`includes`](~/actions/includes) | Must contain "&#123;value&#125;" |
| `unique` | [`unique`](~/actions/unique) | Must not contain duplicates |
| `minDate` | [`minDate`](~/actions/min-date) | Must be on or after &#123;date&#125; |
| `maxDate` | [`maxDate`](~/actions/max-date) | Must be on or before &#123;date&#125; |
| `after` | [`after`](~/actions/after) | Must be after &#123;field&#125; |
| `before` | [`before`](~/actions/before) | Must be before &#123;field&#125; |
| `inn` | [`inn`](~/actions/inn) | Invalid INN |
| `snils` | [`snils`](~/actions/snils) | Invalid SNILS |
| `luhn` | [`luhn`](~/actions/luhn) | Invalid card number |
| `prohibited` | [`prohibitedIf`](~/conditions/prohibited-if) | Must be empty |
| `file` | [`file`](~/schemas/file) | Must be a file |
| `fileSize` | [`file`](~/schemas/file) — maxSize | File must be at most &#123;max&#125; |
| `fileType` | [`file`](~/schemas/file) — types | File type must be one of: &#123;types&#125; |
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

## 复数形式：“1 character”、“5 characters”

随数字变化的词形写在花括号中，用 `|` 分隔：先写参数，再写各个形式。形式按语言规则选择（`Intl.PluralRules`），语言取自语言文件中的 `$locale` 键：

```ts
setMessages({
  minLength: 'Must be at least {min} {min|character|characters} long',
});
// 1 character, 2 characters
```

| 语言 | 形式数量 | 示例 |
| --- | --- | --- |
| 俄语、乌克兰语 | 3：单数、少数、多数 | `{n\|файл\|файла\|файлов}` |
| 英语、德语 | 2：单数、其他 | `{n\|file\|files}` |
| 中文、日语 | 1 | `{n\|个}` 或不带形式的普通文本 |

内置的英语和俄语语言包已经使用了复数形式。如果给出的形式少于语言所需，则使用最后一个。

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
| `invalid` | [`check`](~/actions/check), [`checkAsync`](~/actions/check-async) | Invalid value | 无效的值 |
| `required` | 任意 Schema 中的空值 | Required | 此项为必填项 |
| `string` | [`string`](~/schemas/string) | Must be a string | 必须是字符串 |
| `number` | [`number`](~/schemas/number) | Must be a number | 必须是数字 |
| `boolean` | [`boolean`](~/schemas/boolean) | Must be a boolean | 必须是布尔值 |
| `date` | [`date`](~/schemas/date) | Must be a valid date | 必须是有效的日期 |
| `object` | [`object`](~/schemas/object) | Must be an object | 必须是对象 |
| `array` | [`array`](~/schemas/array) | Must be an array | 必须是数组 |
| `literal` | [`literal`](~/schemas/literal) | Must be &#123;expected&#125; | 必须是 &#123;expected&#125; |
| `oneOf` | [`oneOf`](~/schemas/one-of), [`enumOf`](~/schemas/enum-of) | Must be one of: &#123;options&#125; | 必须是以下值之一：&#123;options&#125; |
| `union` | [`union`](~/schemas/union) | Does not match any allowed type | 不符合任何允许的类型 |
| `variant` | [`variant`](~/schemas/variant) | Unknown type, expected one of: &#123;options&#125; | 未知类型，允许的值：&#123;options&#125; |
| `depth` | [`lazy`](~/schemas/lazy) | Too deeply nested (max &#123;max&#125;) | 嵌套层级过深（最多 &#123;max&#125;） |
| `unknownKey` | 使用 `unknown: 'strict'` 的 [`object`](~/schemas/object) | Unknown field | 未知字段 |
| `minLength` | 字符串的 [`minLength`](~/actions/min-length) | Must be at least &#123;min&#125; &#123;min&#124;character&#124;characters&#125; long | 至少需要 &#123;min&#125; 个字符 |
| `maxLength` | 字符串的 [`maxLength`](~/actions/max-length) | Must be at most &#123;max&#125; &#123;max&#124;character&#124;characters&#125; long | 最多 &#123;max&#125; 个字符 |
| `length` | 字符串的 [`length`](~/actions/length) | Must be exactly &#123;length&#125; &#123;length&#124;character&#124;characters&#125; long | 必须为 &#123;length&#125; 个字符 |
| `min` | [`min`](~/actions/min) | Must be at least &#123;min&#125; | 不能小于 &#123;min&#125; |
| `max` | [`max`](~/actions/max) | Must be at most &#123;max&#125; | 不能大于 &#123;max&#125; |
| `integer` | [`integer`](~/actions/integer) | Must be an integer | 必须是整数 |
| `pattern` | [`pattern`](~/actions/pattern) | Invalid format | 格式无效 |
| `email` | [`email`](~/actions/email) | Invalid email | 邮箱地址无效 |
| `minItems` | 数组的 [`minLength`](~/actions/min-length) | Must have at least &#123;min&#125; &#123;min&#124;item&#124;items&#125; | 至少需要 &#123;min&#125; 项 |
| `maxItems` | 数组的 [`maxLength`](~/actions/max-length) | Must have at most &#123;max&#125; &#123;max&#124;item&#124;items&#125; | 最多 &#123;max&#125; 项 |
| `items` | 数组的 [`length`](~/actions/length)、[`tuple`](~/schemas/tuple) | Must have exactly &#123;length&#125; &#123;length&#124;item&#124;items&#125; | 必须为 &#123;length&#125; 项 |
| `between` | [`between`](~/actions/between) | Must be between &#123;min&#125; and &#123;max&#125; | 必须在 &#123;min&#125; 到 &#123;max&#125; 之间 |
| `url` | [`url`](~/actions/url) | Invalid URL | 链接无效 |
| `uuid` | [`uuid`](~/actions/uuid) | Invalid UUID | UUID 无效 |
| `startsWith` | [`startsWith`](~/actions/starts-with) | Must start with "&#123;value&#125;" | 必须以“&#123;value&#125;”开头 |
| `endsWith` | [`endsWith`](~/actions/ends-with) | Must end with "&#123;value&#125;" | 必须以“&#123;value&#125;”结尾 |
| `includes` | [`includes`](~/actions/includes) | Must contain "&#123;value&#125;" | 必须包含“&#123;value&#125;” |
| `unique` | [`unique`](~/actions/unique) | Must not contain duplicates | 不能包含重复的值 |
| `minDate` | [`minDate`](~/actions/min-date) | Must be on or after &#123;date&#125; | 不能早于 &#123;date&#125; |
| `maxDate` | [`maxDate`](~/actions/max-date) | Must be on or before &#123;date&#125; | 不能晚于 &#123;date&#125; |
| `after` | [`after`](~/actions/after) | Must be after &#123;field&#125; | 必须晚于 &#123;field&#125; |
| `before` | [`before`](~/actions/before) | Must be before &#123;field&#125; | 必须早于 &#123;field&#125; |
| `inn` | [`inn`](~/actions/inn) | Invalid INN | INN（俄罗斯税号）无效 |
| `snils` | [`snils`](~/actions/snils) | Invalid SNILS | SNILS 无效 |
| `luhn` | [`luhn`](~/actions/luhn) | Invalid card number | 卡号无效 |
| `prohibited` | [`prohibitedIf`](~/conditions/prohibited-if) | Must be empty | 此项必须为空 |
| `file` | [`file`](~/schemas/file) | Must be a file | 请选择文件 |
| `fileSize` | [`file`](~/schemas/file) — maxSize | File must be at most &#123;max&#125; | 文件不能超过 &#123;max&#125; |
| `fileType` | [`file`](~/schemas/file) — types | File type must be one of: &#123;types&#125; | 允许的文件类型：&#123;types&#125; |
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
