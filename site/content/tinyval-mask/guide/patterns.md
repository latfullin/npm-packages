::: ru
Шаблон — строка, в которой специальные символы означают «сюда вводится…», а всё остальное выводится как есть.
:::

::: en
A pattern is a string where special characters mean "a … goes here", and everything else is shown as is.
:::

::: zh
模板是一个字符串，其中特殊字符表示“此处输入……”，其余字符原样显示。
:::

::: ru
## Синтаксис

| Символ | Значение |
| --- | --- |
| `9` | Цифра |
| `a` | Буква любого алфавита |
| `*` | Буква или цифра |
| `[ ... ]` | Необязательная часть: заполняется целиком или не заполняется |
| `\` | Следующий символ — как есть: `\9` выведет девятку |
| любой другой | Выводится как есть: скобки, пробелы, дефисы, `+7` |
:::

::: en
## Syntax

| Character | Meaning |
| --- | --- |
| `9` | A digit |
| `a` | A letter of any alphabet |
| `*` | A letter or a digit |
| `[ ... ]` | An optional part: filled completely or not at all |
| `\` | The next character as is: `\9` shows a nine |
| anything else | Shown as is: brackets, spaces, dashes, `+7` |
:::

::: zh
## 语法

| 字符 | 含义 |
| --- | --- |
| `9` | 数字 |
| `a` | 任意字母 |
| `*` | 字母或数字 |
| `[ ... ]` | 可选部分：要么全部填写，要么不填 |
| `\` | 下一个字符原样输出：`\9` 显示数字九 |
| 其他字符 | 原样显示：括号、空格、短横线、`+7` |
:::

```ts
mask('12345678', '(999) 999-99'); // '(123) 456-78'
mask('ab12', 'aa-99');            // 'ab-12'
mask('1230', '99:99[:99]');       // '12:30' — seconds are optional
mask('12', '\\9-99');             // '9-12'
```

::: ru
## Как обрабатывается ввод

- Символы, которые не подходят к позиции, пропускаются: `mask('a1b2', '99')` → `'12'`.
- Литералы после последнего введённого символа не дописываются — пользователь видит `(123`, а не `(123) `.
- Литералы во вводе совпадают с литералами шаблона, поэтому форматирование уже отформатированного значения ничего не меняет.
- Лишние символы отбрасываются.
:::

::: en
## How input is processed

- Characters that don't fit a position are skipped: `mask('a1b2', '99')` → `'12'`.
- Literals after the last typed character are not added — the user sees `(123`, not `(123) `.
- Literals in the input match the pattern's literals, so formatting an already formatted value changes nothing.
- Extra characters are dropped.
:::

::: zh
## 输入如何处理

- 不符合位置要求的字符会被跳过：`mask('a1b2', '99')` → `'12'`。
- 最后一个输入字符之后的字面量不会补上 —— 用户看到的是 `(123`，而不是 `(123) `。
- 输入中的字面量会与模板中的字面量匹配，因此对已格式化的值再次格式化不会改变结果。
- 多余的字符会被丢弃。
:::

::: ru
## Свои токены

Токен — регулярное выражение для одного символа и, по желанию, преобразование:
:::

::: en
## Custom tokens

A token is a regular expression for one character and, optionally, a transform:
:::

::: zh
## 自定义令牌

令牌是匹配单个字符的正则表达式，还可以带有转换：
:::

```ts
const serial = createMask({
  pattern: 'HH-HH-HH',
  tokens: { H: { pattern: /[0-9a-f]/i, transform: 'upper' } },
});

mask('a1b2c3', serial); // 'A1-B2-C3'
```

::: ru
`transform` — `'upper'`, `'lower'` или функция `(char) => string`.

## Несколько шаблонов

Массив шаблонов: выбирается первый, в который ввод помещается целиком. Перечисляйте от короткого к длинному:
:::

::: en
`transform` is `'upper'`, `'lower'` or a `(char) => string` function.

## Several patterns

An array of patterns: the first one that fits the whole input is used. List them from short to long:
:::

::: zh
`transform` 可以是 `'upper'`、`'lower'` 或函数 `(char) => string`。

## 多个模板

模板数组：使用第一个能完整容纳输入的模板。请按从短到长的顺序列出：
:::

```ts
const code = createMask(['999-999', '9999-9999']);

mask('123456', code);   // '123-456'
mask('12345678', code); // '1234-5678'
```

::: ru
## Шаблон-функция

Когда шаблон зависит от введённого — например, от первых цифр номера карты:
:::

::: en
## Pattern function

When the pattern depends on the input — e.g. on the first digits of a card number:
:::

::: zh
## 模板函数

当模板取决于输入内容时 —— 例如取决于卡号的前几位：
:::

```ts
const cardMask = createMask({
  pattern: (input) => (/^3[47]/.test(input) ? '9999 999999 99999' : '9999 9999 9999 9999'),
});
```

::: ru
## Код страны в начале шаблона

Если шаблон начинается с литералов, похожих на ввод (`+375`, `+998`), они считаются введёнными, только когда ввод начинается с `+` или цифр больше, чем вмещает шаблон (вставили номер с кодом). Иначе первая цифра номера не «съедается» кодом страны: `mask('331234567', phone('by'))` → `+375 (33) 123-45-67`.
:::

::: en
## Country code at the start

If a pattern starts with literals that look like input (`+375`, `+998`), they count as typed only when the input starts with `+` or has more digits than the pattern holds (a number pasted with the code). Otherwise the first digit isn't swallowed by the country code: `mask('331234567', phone('by'))` → `+375 (33) 123-45-67`.
:::

::: zh
## 模板开头的国家代码

如果模板以看起来像输入内容的字面量开头（`+375`、`+998`），只有当输入以 `+` 开头，或数字数量超过模板容量（粘贴了带代码的号码）时，才视为已输入。否则号码的第一位不会被国家代码“吞掉”：`mask('331234567', phone('by'))` → `+375 (33) 123-45-67`。
:::

## @t(see)

::: ru
- [createMask](~/api/create-mask) — все опции
- [Готовые маски](~/api/presets)
:::

::: en
- [createMask](~/api/create-mask) — all options
- [Ready-made masks](~/api/presets)
:::

::: zh
- [createMask](~/api/create-mask)：全部选项
- [预设掩码](~/api/presets)
:::
