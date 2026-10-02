// Контекст формы: вложенные компоненты получают форму без передачи через props
import { inject, type InjectionKey } from 'vue';
import type { Form } from './form.js';

export const FORM_KEY: InjectionKey<Form<any, any>> = Symbol('tinyval-vue.form');

export function useFormContext<V extends object = any, T = any>(): Form<V, T> {
  const form = inject(FORM_KEY, null);
  if (!form) throw new Error('tinyval-vue: no form found — call useForm() in a parent component or pass the form explicitly');
  return form as Form<V, T>;
}

// id поля зависит только от формы и пути — так <TvError> находит id, на который ссылается aria-describedby поля
export const fieldId = (form: Form<any, any>, path: string) => `${form.id}-${path.replace(/[^\w-]/g, '-')}`;

export const isForm = (v: unknown): v is Form<any, any> =>
  !!v && typeof v === 'object' && 'values' in v && 'handleSubmit' in v;
