::: ru
Предупреждает при закрытии вкладки или перезагрузке страницы, если в форме есть несохранённые изменения. Во время отправки и после успешного сохранения не мешает.
:::

::: en
Warns when the tab is closed or the page is reloaded while the form has unsaved changes. It doesn't interfere during submission or after a successful save.
:::

::: zh
当表单存在未保存的修改时，在关闭标签页或刷新页面时发出提醒。提交过程中以及成功保存后不会打扰用户。
:::

## @t(signature)

```ts
function useLeaveGuard(form: Form, options?: LeaveGuardOptions): () => void
```

::: ru
| Опция | Описание |
| --- | --- |
| `onBeforeRouteLeave` | Функция `onBeforeRouteLeave` из vue-router — тогда предупреждение сработает и при переходах внутри приложения |
| `confirm` | Своё окно подтверждения для переходов внутри приложения: `(message) => boolean \| Promise<boolean>`. По умолчанию `window.confirm` |
| `message` | Текст вопроса для переходов внутри приложения |

Возвращает функцию, которая снимает предупреждение при закрытии страницы. В компоненте вызывать её не нужно — обработчик снимается сам.

При закрытии вкладки браузер показывает своё стандартное сообщение — его текст изменить нельзя.
:::

::: en
| Option | Description |
| --- | --- |
| `onBeforeRouteLeave` | The `onBeforeRouteLeave` function from vue-router — then the warning also works for in-app navigation |
| `confirm` | Your own confirmation dialog for in-app navigation: `(message) => boolean \| Promise<boolean>`. Defaults to `window.confirm` |
| `message` | Question text for in-app navigation |

Returns a function that removes the page-close warning. In a component you don't need to call it — the handler is removed automatically.

When a tab is closed the browser shows its own standard message — its text can't be changed.
:::

::: zh
| 选项 | 说明 |
| --- | --- |
| `onBeforeRouteLeave` | 来自 vue-router 的 `onBeforeRouteLeave` 函数 —— 传入后应用内跳转时也会提醒 |
| `confirm` | 应用内跳转时使用的自定义确认框：`(message) => boolean \| Promise<boolean>`。默认为 `window.confirm` |
| `message` | 应用内跳转时的提问文本 |

返回一个用于移除关闭页面提醒的函数。在组件中无需调用 —— 会自动移除。

关闭标签页时浏览器会显示自己的标准提示 —— 文本无法修改。
:::

## @t(example)

```ts
import { onBeforeRouteLeave } from 'vue-router';

useLeaveGuard(form, {
  onBeforeRouteLeave,
  confirm: (message) => dialog.confirm({ title: message }), // e.g. a UI library dialog returning Promise<boolean>
  message: 'Leave without saving?',
});
```

## @t(see)

::: ru
- [useDraft](~/api/use-draft)
- [Редактирование и черновики](~/guide/editing)
:::

::: en
- [useDraft](~/api/use-draft)
- [Editing & drafts](~/guide/editing)
:::

::: zh
- [useDraft](~/api/use-draft)
- [编辑与草稿](~/guide/editing)
:::
