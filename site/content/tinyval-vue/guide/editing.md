::: ru
Формы редактирования отличаются от форм создания: данные уже есть, отправлять нужно только изменения, а потерять правки обидно.
:::

::: en
Edit forms differ from create forms: the data already exists, only changes should be sent, and losing edits is painful.
:::

::: zh
编辑表单与创建表单不同：数据已经存在，只需提交修改的部分，而丢失修改会让人很沮丧。
:::

::: ru
## Загрузка данных

Начальные значения часто приходят с сервера уже после создания формы. Передайте их в `reset` — они станут новой точкой отсчёта для `dirty` и `changes`:
:::

::: en
## Loading data

Initial values often arrive from the server after the form is created. Pass them to `reset` — they become the new baseline for `dirty` and `changes`:
:::

::: zh
## 加载数据

初始值通常在表单创建之后才从服务端返回。把它们传给 `reset` —— 它们会成为 `dirty` 和 `changes` 的新基准：
:::

```ts
const form = useForm(UpdateUser, { initial: { name: '', email: '', bio: '' } });

onMounted(async () => {
  const user = await api.get(`/users/${id}`);
  form.reset({ name: user.name, email: user.email, bio: user.bio ?? '' });
});
```

::: ru
## Только изменённые поля — PATCH

`form.changes` содержит только то, что пользователь поменял. Вместе со схемой [`partial`](@/tinyval/objects/partial) это готовый `PATCH`:
:::

::: en
## Only changed fields — PATCH

`form.changes` contains only what the user changed. Together with a [`partial`](@/tinyval/objects/partial) schema this is a ready `PATCH`:
:::

::: zh
## 只提交修改的字段 —— PATCH

`form.changes` 只包含用户修改过的内容。配合 [`partial`](@/tinyval/objects/partial) Schema，就可以直接用于 `PATCH`：
:::

```ts
const submit = form.handleSubmit(async () => {
  await api.patch(`/users/${id}`, form.changes); // { bio: 'New bio' }
});
```

```vue
<button :disabled="!form.dirty || form.submitting">Save</button>
<span v-if="form.isDirty('email')">Email will be changed</span>
```

::: ru
После успешной отправки текущие значения считаются сохранёнными: `dirty` становится `false`, `changes` — пустым. Если в обработчике вызван `setErrors` (сервер отклонил данные), изменения остаются несохранёнными.
:::

::: en
After a successful submit the current values count as saved: `dirty` becomes `false`, `changes` becomes empty. If the handler calls `setErrors` (the server rejected the data), the changes stay unsaved.
:::

::: zh
成功提交后，当前值被视为已保存：`dirty` 变为 `false`，`changes` 变为空。如果处理函数中调用了 `setErrors`（服务端拒绝了数据），修改仍视为未保存。
:::

::: ru
## Черновик и предупреждение об уходе

[`useDraft`](~/api/use-draft) сохраняет введённое и восстанавливает его после перезагрузки, [`useLeaveGuard`](~/api/use-leave-guard) предупреждает при закрытии вкладки с несохранёнными изменениями:
:::

::: en
## Draft and leave warning

[`useDraft`](~/api/use-draft) saves the input and restores it after a reload; [`useLeaveGuard`](~/api/use-leave-guard) warns when a tab with unsaved changes is closed:
:::

::: zh
## 草稿与离开提醒

[`useDraft`](~/api/use-draft) 保存输入内容并在刷新后恢复；[`useLeaveGuard`](~/api/use-leave-guard) 在关闭有未保存修改的标签页时发出提醒：
:::

```ts
const form = useForm(Post, { initial: { title: '', body: '' } });
useDraft(form, `post-${id}`);
useLeaveGuard(form);
```

## @t(see)

::: ru
- [partial](@/tinyval/objects/partial)
- [useForm](~/api/use-form)
:::

::: en
- [partial](@/tinyval/objects/partial)
- [useForm](~/api/use-form)
:::

::: zh
- [partial](@/tinyval/objects/partial)
- [useForm](~/api/use-form)
:::
