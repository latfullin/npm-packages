::: ru
Все тексты ошибок можно заменить своими — так же, как lang-файлы в Laravel: скопировать файл в проект, поправить и подключить.
:::

::: en
All error texts can be replaced with your own — just like lang files in Laravel: copy the file into your project, edit it and load it.
:::

::: zh
所有错误文本都可以替换为自己的 —— 就像 Laravel 的语言文件：把文件复制到项目中，修改后加载即可。
:::

::: ru
## 1. Скопировать lang-файл
:::

::: en
## 1. Copy a lang file
:::

::: zh
## 1. 复制语言文件
:::

```bash
npx tinyval lang ru
```

::: ru
Команда создаст `lang/tinyval/ru.ts` со всеми текстами. Доступны `en`, `ru`, `zh`.

| Опция | Что делает |
| --- | --- |
| `--out <папка>` | Куда положить файл. По умолчанию `lang/tinyval` |
| `--js` | Создать `.js` вместо `.ts` |
| `--force` | Перезаписать существующий файл |
:::

::: en
The command creates `lang/tinyval/ru.ts` with all texts. Available: `en`, `ru`, `zh`.

| Option | What it does |
| --- | --- |
| `--out <dir>` | Where to put the file. Default: `lang/tinyval` |
| `--js` | Create `.js` instead of `.ts` |
| `--force` | Overwrite an existing file |
:::

::: zh
该命令会创建包含全部文本的 `lang/tinyval/ru.ts`。可用：`en`、`ru`、`zh`。

| 选项 | 作用 |
| --- | --- |
| `--out <目录>` | 文件存放位置。默认为 `lang/tinyval` |
| `--js` | 创建 `.js` 而不是 `.ts` |
| `--force` | 覆盖已有文件 |
:::

::: ru
## 2. Поправить тексты
:::

::: en
## 2. Edit the texts
:::

::: zh
## 2. 修改文本
:::

```ts
// lang/tinyval/ru.ts
import type { Messages } from 'tinyval';

export default {
  required: 'Поле «{label}» обязательно',
  minLength: '{label}: минимум {min} символов',
  email: 'Проверьте адрес почты',
  // ...
} satisfies Messages;
```

::: ru
`satisfies Messages` — TypeScript проверит, что в файле есть все коды ошибок, и подскажет их названия. Если нужно поменять только несколько текстов, файл не нужен целиком — достаточно [`setMessages`](~/api/set-messages) с этими ключами.
:::

::: en
`satisfies Messages` makes TypeScript check that the file has every error code and suggests their names. To change just a few texts you don't need the whole file — [`setMessages`](~/api/set-messages) with those keys is enough.
:::

::: zh
`satisfies Messages` 让 TypeScript 检查文件中是否包含所有错误代码，并提示它们的名称。如果只需修改少数文本，不需要整个文件 —— 用这些键调用 [`setMessages`](~/api/set-messages) 即可。
:::

::: ru
## 3. Подключить
:::

::: en
## 3. Load it
:::

::: zh
## 3. 加载
:::

```ts
import { setMessages } from 'tinyval';
import messages from './lang/tinyval/ru';

setMessages(messages);
```

::: ru
Один раз при старте приложения. Если языков несколько и язык зависит от запроса — передавайте файл в сам вызов: `validate(schema, data, { messages })`.
:::

::: en
Once on startup. If there are several languages and the language depends on the request, pass the file to the call: `validate(schema, data, { messages })`.
:::

::: zh
在应用启动时调用一次。如果有多种语言且语言取决于请求，请把文件传给调用本身：`validate(schema, data, { messages })`。
:::

::: ru
## Тексты для конкретных полей

Кроме кодов, в lang-файле могут быть ключи «поле.код» — как `custom` в Laravel. Для элементов массива вместо индекса пишется `*`:
:::

::: en
## Texts for specific fields

Besides codes, a lang file can have "field.code" keys — like `custom` in Laravel. For array items use `*` instead of the index:
:::

::: zh
## 特定字段的文本

除了代码之外，语言文件还可以包含“字段.代码”形式的键 —— 类似 Laravel 的 `custom`。数组元素用 `*` 代替索引：
:::

```ts
export default {
  ...ru,
  'email.required': 'Укажите почту — на неё придёт письмо',
  'password.minLength': 'Пароль слишком простой',
  'items.*.qty.min': 'Количество — от {min}',
} satisfies Messages;
```

::: ru
Порядок выбора текста: сообщение в самой схеме → «поле.код» → код. На каждом шаге сначала смотрится опция `messages` вызова, потом [`setMessages`](~/api/set-messages).
:::

::: en
Text priority: the message in the schema → "field.code" → code. At each step the call's `messages` option is checked first, then [`setMessages`](~/api/set-messages).
:::

::: zh
文本优先级：Schema 中的信息 → “字段.代码” → 代码。每一步都先查看调用的 `messages` 选项，再查看 [`setMessages`](~/api/set-messages)。
:::

::: ru
## Названия полей

Названия для `{label}` задаются для всего приложения через [`setLabels`](~/api/set-labels) — как `attributes` в Laravel:
:::

::: en
## Field names

Names for `{label}` are set for the whole app with [`setLabels`](~/api/set-labels) — like `attributes` in Laravel:
:::

::: zh
## 字段名称

通过 [`setLabels`](~/api/set-labels) 为整个应用设置 `{label}` 的名称 —— 类似 Laravel 的 `attributes`：
:::

```ts
setLabels({ email: 'Почта', 'items.*.qty': 'Количество' });
```

## @t(see)

::: ru
- [Сообщения и локализация](~/guide/messages) — все коды ошибок
- [setMessages](~/api/set-messages), [setLabels](~/api/set-labels)
:::

::: en
- [Messages & i18n](~/guide/messages) — all error codes
- [setMessages](~/api/set-messages), [setLabels](~/api/set-labels)
:::

::: zh
- [错误信息与国际化](~/guide/messages)：全部错误代码
- [setMessages](~/api/set-messages)、[setLabels](~/api/set-labels)
:::
