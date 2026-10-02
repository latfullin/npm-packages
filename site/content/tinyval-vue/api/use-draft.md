::: ru
Черновик формы: введённое сохраняется в `localStorage` и восстанавливается, если пользователь перезагрузил страницу или вернулся позже. Удаляется сам, когда форма успешно отправлена или сброшена.
:::

::: en
A form draft: what the user typed is saved to `localStorage` and restored after a page reload or a later visit. It is removed automatically when the form is submitted successfully or reset.
:::

::: zh
表单草稿：用户输入的内容会保存到 `localStorage`，在刷新页面或稍后返回时恢复。表单成功提交或重置后会自动删除。
:::

## @t(signature)

```ts
function useDraft(form: Form, key: string, options?: { storage?: StorageLike; debounce?: number }): { restored: boolean; clear(): void }
```

::: ru
| Параметр | Описание |
| --- | --- |
| `key` | Ключ в хранилище. Разный для разных форм: `'signup'`, `` `post-${id}` `` |
| `options.storage` | По умолчанию `localStorage`. `sessionStorage` — черновик живёт до закрытия вкладки |
| `options.debounce` | Задержка перед сохранением, мс. По умолчанию `300` |

Возвращает `restored` — был ли черновик восстановлен (например, чтобы показать «Восстановлен черновик») — и `clear()`.
:::

::: en
| Parameter | Description |
| --- | --- |
| `key` | Storage key. Different for different forms: `'signup'`, `` `post-${id}` `` |
| `options.storage` | `localStorage` by default. `sessionStorage` keeps the draft until the tab is closed |
| `options.debounce` | Delay before saving, ms. Default `300` |

Returns `restored` — whether a draft was restored (e.g. to show "Draft restored") — and `clear()`.
:::

::: zh
| 参数 | 说明 |
| --- | --- |
| `key` | 存储中的键。不同表单使用不同的键：`'signup'`、`` `post-${id}` `` |
| `options.storage` | 默认为 `localStorage`。使用 `sessionStorage` 时草稿保留到标签页关闭 |
| `options.debounce` | 保存前的延迟，毫秒。默认 `300` |

返回 `restored`（是否恢复了草稿，例如用于显示“已恢复草稿”）和 `clear()`。
:::

## @t(notes)

::: ru
- Черновик пишется, только пока есть несохранённые изменения (`form.dirty`).
- Не храните в черновике пароли и данные карт: `localStorage` доступен любому скрипту на странице.
- На сервере (SSR) хранилища нет — `useDraft` ничего не делает.
:::

::: en
- The draft is written only while there are unsaved changes (`form.dirty`).
- Don't keep passwords or card data in a draft: `localStorage` is readable by any script on the page.
- On the server (SSR) there is no storage — `useDraft` does nothing.
:::

::: zh
- 只有在存在未保存的修改（`form.dirty`）时才会写入草稿。
- 不要在草稿中保存密码或银行卡数据：页面上的任何脚本都可以读取 `localStorage`。
- 在服务端（SSR）没有存储 —— `useDraft` 不会执行任何操作。
:::

## @t(example)

```vue
<script setup lang="ts">
const form = useForm(Post, { initial: { title: '', body: '' } });
const draft = useDraft(form, 'new-post');
useLeaveGuard(form);
</script>

<template>
  <p v-if="draft.restored">Draft restored · <button type="button" @click="form.reset()">Discard</button></p>
</template>
```

## @t(see)

::: ru
- [useLeaveGuard](~/api/use-leave-guard)
- [Редактирование и черновики](~/guide/editing)
:::

::: en
- [useLeaveGuard](~/api/use-leave-guard)
- [Editing & drafts](~/guide/editing)
:::

::: zh
- [useLeaveGuard](~/api/use-leave-guard)
- [编辑与草稿](~/guide/editing)
:::
