::: ru
Вешает маску на `<input>`: форматирует при вводе и вставке, держит курсор на месте, Backspace проходит через литералы. Подробнее — [Поле ввода](~/guide/browser).
:::

::: en
Puts a mask on an `<input>`: formats on typing and paste, keeps the caret in place, Backspace goes through literals. More in [Input field](~/guide/browser).
:::

::: zh
把掩码绑定到 `<input>`：输入和粘贴时自动格式化，保持光标位置，Backspace 可以越过字面量。详见 [输入框](~/guide/browser)。
:::

## @t(signature)

```ts
function attach(input: HTMLInputElement, mask: MaskInput, options?: AttachOptions): AttachedMask

interface AttachOptions {
  onChange?: (state: MaskState) => void;
  raw?: boolean;
  placeholder?: string;
}

interface MaskState { value: string; raw: string; complete: boolean }

interface AttachedMask {
  readonly raw: string;
  readonly complete: boolean;
  update(mask: MaskInput, options?: AttachOptions): void;
  refresh(): void;
  destroy(): void;
}
```

::: ru
| | Описание |
| --- | --- |
| `onChange` | Вызывается при каждом изменении: отформатированное значение, значение без маски, заполнена ли маска |
| `raw` (опция) | Обработчики ввода (`@input`, `v-model`) получают значение без маски, в поле при этом видна маска |
| `placeholder` | Символ для пустых позиций: `'_'` → `+7 (___) ___-__-__`. Шаблон виден при фокусе и пока поле заполнено не до конца |
| `raw`, `complete` | Текущее значение без маски и заполненность |
| `update(mask, options?)` | Сменить маску или опции (например, при выборе другой страны) |
| `refresh()` | Переформатировать значение, записанное в поле из кода, — курсор останется на месте |
| `destroy()` | Снять маску |
:::

::: en
| | Description |
| --- | --- |
| `onChange` | Called on every change: the formatted value, the unmasked value, whether the mask is filled |
| `raw` (option) | Input handlers (`@input`, `v-model`) get the unmasked value while the field shows the mask |
| `placeholder` | A character for empty positions: `'_'` → `+7 (___) ___-__-__`. The template is visible on focus and while the field isn't complete |
| `raw`, `complete` | The current unmasked value and whether it is filled |
| `update(mask, options?)` | Change the mask or options (e.g. when another country is selected) |
| `refresh()` | Reformat a value written into the field from code — the caret stays in place |
| `destroy()` | Remove the mask |
:::

::: zh
| | 说明 |
| --- | --- |
| `onChange` | 每次变化时调用：格式化后的值、去掉掩码后的值、掩码是否填写完整 |
| `raw`（选项） | 输入处理函数（`@input`、`v-model`）得到去掉掩码的值，输入框中仍显示掩码 |
| `placeholder` | 空位使用的字符：`'_'` → `+7 (___) ___-__-__`。获得焦点时以及未填写完整时显示模板 |
| `raw`、`complete` | 当前去掉掩码后的值以及是否填写完整 |
| `update(mask, options?)` | 更换掩码或选项（例如选择了其他国家） |
| `refresh()` | 重新格式化在代码中写入输入框的值 —— 光标保持不变 |
| `destroy()` | 移除掩码 |
:::

## @t(example)

```ts
const input = document.querySelector<HTMLInputElement>('#phone')!;
const select = document.querySelector<HTMLSelectElement>('#country')!;

const field = attach(input, phone('ru'), {
  onChange: ({ complete }) => input.classList.toggle('done', complete),
});

select.addEventListener('change', () => field.update(phone(select.value as PhoneCountry)));
```

## @t(see)

::: ru
- [Поле ввода](~/guide/browser)
- [vMask](~/api/v-mask) — то же для Vue
:::

::: en
- [Input field](~/guide/browser)
- [vMask](~/api/v-mask) — the same for Vue
:::

::: zh
- [输入框](~/guide/browser)
- [vMask](~/api/v-mask)：Vue 版本
:::
