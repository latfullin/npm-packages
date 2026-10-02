// useField — одно поле формы для своих компонентов: v-model, ошибка, атрибуты доступности
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter, type WritableComputedRef } from 'vue';
import { fieldId, isForm, useFormContext } from './context.js';
import type { Form } from './form.js';
import { getPath, setPath } from './utils.js';

export interface FieldAttrs {
  name: string;
  id: string;
  'aria-invalid': 'true' | undefined;
  'aria-describedby': string | undefined;
  onBlur: () => void;
}

export interface Field<T> {
  value: WritableComputedRef<T>;
  error: ComputedRef<string | undefined>;
  touched: ComputedRef<boolean>;
  dirty: ComputedRef<boolean>;
  // id для элемента с текстом ошибки — на него ссылается aria-describedby
  errorId: ComputedRef<string>;
  // name, id, aria-* и onBlur для <input v-bind="attrs">
  attrs: ComputedRef<FieldAttrs>;
  onBlur: () => void;
}

type PathArg = MaybeRefOrGetter<string>;

// useField('email') — форма из контекста (useForm или <TvForm> выше по дереву); useField(form, 'email') — явно
export function useField<T = unknown>(path: PathArg): Field<T>;
export function useField<T = unknown>(form: Form<any, any>, path: PathArg): Field<T>;
export function useField<T = unknown>(a: Form<any, any> | PathArg, b?: PathArg): Field<T> {
  const form = isForm(a) ? a : useFormContext();
  const path = (isForm(a) ? b : a) as PathArg;
  const p = computed(() => toValue(path));
  const id = computed(() => fieldId(form, p.value));
  const onBlur = () => form.touch(p.value);
  const error = computed(() => form.errors[p.value]);
  const errorId = computed(() => `${id.value}-error`);
  return {
    value: computed({
      get: () => getPath(form.values, p.value) as T,
      set: (v) => setPath(form.values, p.value, v),
    }),
    error,
    touched: computed(() => !!form.touched[p.value]),
    dirty: computed(() => form.isDirty(p.value)),
    errorId,
    attrs: computed(() => ({
      name: p.value,
      id: id.value,
      'aria-invalid': error.value ? 'true' : undefined,
      'aria-describedby': error.value ? errorId.value : undefined,
      onBlur,
    })),
    onBlur,
  };
}
