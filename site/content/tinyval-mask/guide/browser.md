::: ru
[`attach`](~/api/attach) вешает маску на `<input>`. Самое сложное в масках — не форматирование, а поведение при редактировании, и `attach` берёт его на себя.
:::

::: en
[`attach`](~/api/attach) puts a mask on an `<input>`. The hard part of masks isn't formatting but editing behaviour, and `attach` takes care of it.
:::

::: zh
[`attach`](~/api/attach) 把掩码绑定到 `<input>` 上。掩码最难的部分不是格式化，而是编辑时的行为，`attach` 会负责处理这些。
:::

```ts
import { attach } from 'tinyval-mask';
import { phone } from 'tinyval-mask/presets';

const input = document.querySelector<HTMLInputElement>('#phone')!;
const field = attach(input, phone(), {
  onChange: ({ value, raw, complete }) => console.log(value, raw, complete),
});

field.raw;      // '79991234567'
field.complete; // true
field.destroy(); // remove the mask
```

::: ru
## Что происходит при вводе

| Действие | Поведение |
| --- | --- |
| Ввод в конце | Литералы появляются сами: `9` → `+7 (9` |
| Ввод в середине | Символы сдвигаются, курсор остаётся сразу за введённым |
| Backspace после `)` или `-` | Удаляется ближайшая цифра, курсор не «застревает» на литерале |
| Delete перед литералом | То же в другую сторону |
| Вставка | Принимается любой формат: `8 999 123-45-67`, `+79991234567`, `(999) 1234567` |
| Неподходящие символы | Игнорируются: буквы в номере не появятся |

Курсор считается по введённым символам, а не по позиции в строке. Поэтому он не прыгает, даже когда маска добавляет или убирает разделители — например, пробелы между тысячами в [`numberMask`](~/api/number-mask).
:::

::: en
## What happens while typing

| Action | Behaviour |
| --- | --- |
| Typing at the end | Literals appear by themselves: `9` → `+7 (9` |
| Typing in the middle | Characters shift, the caret stays right after the typed one |
| Backspace after `)` or `-` | The nearest digit is removed; the caret doesn't get stuck on the literal |
| Delete before a literal | The same in the other direction |
| Paste | Any format is accepted: `8 999 123-45-67`, `+79991234567`, `(999) 1234567` |
| Unsuitable characters | Ignored: letters won't appear in a phone number |

The caret is tracked by typed characters, not by position in the string. So it doesn't jump even when the mask adds or removes separators — e.g. thousands spaces in [`numberMask`](~/api/number-mask).
:::

::: zh
## 输入时会发生什么

| 操作 | 行为 |
| --- | --- |
| 在末尾输入 | 字面量会自动出现：`9` → `+7 (9` |
| 在中间输入 | 字符后移，光标停在刚输入的字符之后 |
| 在 `)` 或 `-` 后按 Backspace | 删除最近的数字，光标不会“卡”在字面量上 |
| 在字面量前按 Delete | 方向相反，行为相同 |
| 粘贴 | 接受任意格式：`8 999 123-45-67`、`+79991234567`、`(999) 1234567` |
| 不合适的字符 | 会被忽略：号码中不会出现字母 |

光标按已输入的字符计算，而不是按字符串中的位置。因此即使掩码添加或删除分隔符（例如 [`numberMask`](~/api/number-mask) 中的千位空格），光标也不会跳动。
:::

::: ru
## Совместимость с фреймворками

`attach` форматирует значение раньше обработчиков фреймворка (слушатель `input` в фазе перехвата), поэтому `v-model`, `onChange` в React и подобные получают уже отформатированное значение. После программной правки (Backspace через литерал) `attach` сам отправляет событие `input`.

Если значение поля меняется из кода (`input.value = …`), вызовите `field.update(mask)` — оно переформатирует значение.
:::

::: en
## Framework compatibility

`attach` formats the value before framework handlers (an `input` listener in the capture phase), so `v-model`, React's `onChange` and similar get the formatted value. After a programmatic edit (Backspace through a literal) `attach` dispatches an `input` event itself.

If the field value is changed from code (`input.value = …`), call `field.update(mask)` — it reformats the value.
:::

::: zh
## 与框架的兼容性

`attach` 会在框架的处理函数之前格式化值（在捕获阶段监听 `input`），因此 `v-model`、React 的 `onChange` 等拿到的都是已格式化的值。在程序化编辑（越过字面量的 Backspace）之后，`attach` 会自行派发 `input` 事件。

如果在代码中修改了输入框的值（`input.value = …`），请调用 `field.update(mask)` —— 它会重新格式化该值。
:::

## @t(see)

::: ru
- [attach](~/api/attach)
- [Vue](~/guide/vue) — директива `v-mask`
:::

::: en
- [attach](~/api/attach)
- [Vue](~/guide/vue) — the `v-mask` directive
:::

::: zh
- [attach](~/api/attach)
- [Vue](~/guide/vue)：`v-mask` 指令
:::
