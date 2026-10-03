::: ru
Файл из `<input type="file">` или `FormData`: размер и тип.
:::

::: en
A file from `<input type="file">` or `FormData`: size and type.
:::

::: zh
来自 `<input type="file">` 或 `FormData` 的文件：大小和类型。
:::

## @t(signature)

```ts
function file(options?: { maxSize?: number; types?: string[] }, msg?: Message): Schema<File>
```

## @t(params)

::: ru
| Параметр | Тип | Описание |
| --- | --- | --- |
| `options.maxSize` | `number` | Максимальный размер в байтах: `2 * 1024 * 1024` |
| `options.types` | `string[]` | MIME-типы, группы и расширения: `['image/*', 'application/pdf', '.docx']` |
| `msg` | `Message` | Своё сообщение для всех ошибок файла |
:::

::: en
| Parameter | Type | Description |
| --- | --- | --- |
| `options.maxSize` | `number` | Maximum size in bytes: `2 * 1024 * 1024` |
| `options.types` | `string[]` | MIME types, groups and extensions: `['image/*', 'application/pdf', '.docx']` |
| `msg` | `Message` | Custom message for all file errors |
:::

::: zh
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `options.maxSize` | `number` | 最大字节数：`2 * 1024 * 1024` |
| `options.types` | `string[]` | MIME 类型、类型组和扩展名：`['image/*', 'application/pdf', '.docx']` |
| `msg` | `Message` | 文件所有错误的自定义信息 |
:::

## @t(codes)

::: ru
| Код | Когда | Сообщение по умолчанию |
| --- | --- | --- |
| `required` | Значение пустое, а поле обязательно | Required |
| `file` | Не файл | Must be a file |
| `fileSize` | Файл больше `maxSize` | File must be at most &#123;max&#125; |
| `fileType` | Тип не из списка | File type must be one of: &#123;types&#125; |

Тексты можно поменять: см. [Сообщения и локализация](~/guide/messages).
:::

::: en
| Code | When | Default message |
| --- | --- | --- |
| `required` | The value is empty and the field is required | Required |
| `file` | Not a file | Must be a file |
| `fileSize` | The file is larger than `maxSize` | File must be at most &#123;max&#125; |
| `fileType` | The type is not in the list | File type must be one of: &#123;types&#125; |

You can change the texts: see [Messages & i18n](~/guide/messages).
:::

::: zh
| 代码 | 触发条件 | 默认信息 |
| --- | --- | --- |
| `required` | 值为空且该字段为必填 | Required |
| `file` | 不是文件 | Must be a file |
| `fileSize` | 文件大于 `maxSize` | File must be at most &#123;max&#125; |
| `fileType` | 类型不在列表中 | File type must be one of: &#123;types&#125; |

可以修改这些文本：见 [错误信息与国际化](~/guide/messages)。
:::

## @t(notes)

::: ru
- Работает в браузере и в Node 20+ — там `File` приходит из `FormData` (`request.formData()` в fetch, Hono, Nuxt).
- В сообщении `{max}` — размер в читаемом виде: `2 MB`. В `params` ошибки есть и `size` — размер файла.
- Расширения сравниваются без учёта регистра: `.pdf` пропустит `DOC.PDF`.
- Несколько файлов — [`array`](~/schemas/array) с [`maxLength`](~/actions/max-length).
:::

::: en
- Works in the browser and in Node 20+ — there `File` comes from `FormData` (`request.formData()` in fetch, Hono, Nuxt).
- In the message `{max}` is a readable size: `2 MB`. The error `params` also have `size` — the file size.
- Extensions are case-insensitive: `.pdf` accepts `DOC.PDF`.
- Several files — [`array`](~/schemas/array) with [`maxLength`](~/actions/max-length).
:::

::: zh
- 可在浏览器和 Node 20+ 中使用 —— 在 Node 中 `File` 来自 `FormData`（fetch、Hono、Nuxt 中的 `request.formData()`）。
- 信息中的 `{max}` 是易读的大小：`2 MB`。错误的 `params` 中还有 `size` —— 文件大小。
- 扩展名不区分大小写：`.pdf` 也接受 `DOC.PDF`。
- 多个文件 —— 使用 [`array`](~/schemas/array) 配合 [`maxLength`](~/actions/max-length)。
:::

## @t(examples)

::: ru
### Аватар
:::

::: en
### Avatar
:::

::: zh
### 头像
:::

```ts
const avatar = file({ maxSize: 2 * 1024 * 1024, types: ['image/*'] });
```

::: ru
### Несколько документов
:::

::: en
### Several documents
:::

::: zh
### 多个文档
:::

```ts
const Application = object({
  documents: pipe(array(file({ types: ['application/pdf', '.docx'] })), minLength(1), maxLength(5)),
});
```

::: ru
### На сервере
:::

::: en
### On the server
:::

::: zh
### 在服务端
:::

```ts
app.post('/upload', async (c) => {
  const form = Object.fromEntries(await c.req.formData());
  const { avatar } = parse(object({ avatar: file({ maxSize: 2 * 1024 * 1024 }) }), form);
});
```

## @t(see)

::: ru
- [array](~/schemas/array)
- [maxLength](~/actions/max-length)
:::

::: en
- [array](~/schemas/array)
- [maxLength](~/actions/max-length)
:::

::: zh
- [array](~/schemas/array)
- [maxLength](~/actions/max-length)
:::
