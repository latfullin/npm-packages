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
function attach(input: HTMLInputElement, mask: MaskInput, options?: { onChange?: (state: MaskState) => void }): AttachedMask

interface MaskState { value: string; raw: string; complete: boolean }

interface AttachedMask {
  readonly raw: string;
  readonly complete: boolean;
  update(mask: MaskInput): void;
  destroy(): void;
}
```

::: ru
| | Описание |
| --- | --- |
| `onChange` | Вызывается при каждом изменении: отформатированное значение, значение без маски, заполнена ли маска |
| `raw`, `complete` | Текущее значение без маски и заполненность |
| `update(mask)` | Сменить маску (например, при выборе другой страны) или переформатировать значение, изменённое из кода |
| `destroy()` | Снять маску |
:::

::: en
| | Description |
| --- | --- |
| `onChange` | Called on every change: the formatted value, the unmasked value, whether the mask is filled |
| `raw`, `complete` | The current unmasked value and whether it is filled |
| `update(mask)` | Change the mask (e.g. when another country is selected) or reformat a value changed from code |
| `destroy()` | Remove the mask |
:::

::: zh
| | 说明 |
| --- | --- |
| `onChange` | 每次变化时调用：格式化后的值、去掉掩码后的值、掩码是否填写完整 |
| `raw`、`complete` | 当前去掉掩码后的值以及是否填写完整 |
| `update(mask)` | 更换掩码（例如选择了其他国家），或重新格式化在代码中修改的值 |
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
