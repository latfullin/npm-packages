# tinyval-vue

Vue 3 form state on [tinyval](https://www.npmjs.com/package/tinyval) schemas: values for `v-model`, errors, touched fields, submission, server errors, async checks, field arrays, multi-step forms and drafts — as composables or components. ~2 kB gzip for `useForm`, ~4 kB for everything.

Documentation: **[tinyval.ru/tinyval-vue](https://tinyval.ru/tinyval-vue/)** — guide, API reference and live demo.

## Install

```bash
npm install tinyval tinyval-vue
```

## Usage

```vue
<script setup lang="ts">
import { object, string, pipe, trim, minLength, email } from 'tinyval';
import { useForm } from 'tinyval-vue';

const Signup = object({
  name: pipe(string(), trim(), minLength(2)),
  email: pipe(string(), email()),
});

const form = useForm(Signup, { initial: { name: '', email: '' } });

// data: { name: string; email: string }; a thrown Laravel 422 (axios / ofetch) is shown at the fields
const submit = form.handleSubmit((data) => axios.post('/signup', data));
</script>

<template>
  <form @submit="submit">
    <input v-model="form.values.email" @blur="form.touch('email')" />
    <span v-if="form.errors.email">{{ form.errors.email }}</span>
    <button :disabled="form.submitting">Sign up</button>
  </form>
</template>
```

## Options

| Option | Default | Description |
| --- | --- | --- |
| `initial` | — | Initial field values (required); the type of `form.values` |
| `mode` | `'blur'` | When errors are shown: `'blur'`, `'input'` or `'submit'` |
| `debounce` | `300` | Delay before async checks while typing, ms |
| `focusOnError` | `true` | Focus the first invalid field (by `name`) on a failed submit |
| `extractErrors` | 422 response | Get field errors from an exception thrown in `handleSubmit` |
| `id` | `useId()` | Base for field ids (SSR-stable in Vue 3.5+) |
| `messages`, `labels`, `maxDepth` | | Same as tinyval `validate` options |

## Form

- **State:** `values`, `errors` (visible), `allErrors`, `valid`, `dirty`, `changes` (only changed fields, for PATCH), `touched`, `validating`, `submitting`, `submitted`, `submitCount`, `submitSucceeded`, `data`
- **Methods:** `touch`, `handleSubmit(onValid, onInvalid?)`, `validate(paths?)` (whole form or one step), `validateField`, `isDirty`, `setValue`, `setValues`, `setErrors`, `setFieldError`, `clearErrors`, `setTouched`, `resetField`, `reset`, `bind` (for UI libraries)

The form is provided to child components: `useField('email')`, `useFieldArray('items')` and `useFormContext()` work there without passing the form.

## Components

```vue
<TvForm :form="form" @submit="save">
  <TvField name="email" type="email" />
  <TvError name="email" />

  <TvField name="plan" type="radio" value="pro" />
  <TvField name="tags" type="checkbox" value="js" />
  <TvField name="city" as="select"><option value="msk">Moscow</option></TvField>
  <TvField name="avatar" type="file" />
  <TvField name="name" :as="ElInput" />

  <TvFieldArray name="items" v-slot="{ fields, append, remove }">…</TvFieldArray>
</TvForm>
```

Async checks are debounced and stale responses are ignored. Server errors disappear when the user edits the field.

## More composables

```ts
// Your own field component: v-model value, error, name / id / aria-* attributes
const { value, error, attrs, errorId } = useField<string>(form, 'email');

// Lists with stable v-for keys; touched marks follow rows on remove / move
const items = useFieldArray<{ title: string }>(form, 'items');
items.append({ title: '' });
items.move(0, 2);

// Draft in localStorage, restored after reload, removed after a successful submit
const draft = useDraft(form, 'new-post');

// Warn before closing the tab (and on vue-router navigation) with unsaved changes
useLeaveGuard(form, { onBeforeRouteLeave });
```

## Docs

Full documentation with live examples (ru, en, zh): [tinyval.ru/tinyval-vue](https://tinyval.ru/tinyval-vue/).

## License

MIT
