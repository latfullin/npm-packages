// Компоненты: <TvForm>, <TvField>, <TvError>, <TvFieldArray> — та же логика, что у composable, но без кода в script
import { computed, defineComponent, h, provide, type Component, type PropType } from 'vue';
import { useFieldArray } from './array.js';
import { FORM_KEY, fieldId, useFormContext } from './context.js';
import { useField } from './field.js';
import type { Form } from './form.js';

const formProp = { type: Object as PropType<Form<any, any>>, default: undefined };

// <TvForm :form="form" @submit="save"> — <form> с отправкой через handleSubmit; передаёт форму вложенным полям
export const TvForm = defineComponent({
  name: 'TvForm',
  props: {
    form: { type: Object as PropType<Form<any, any>>, required: true },
    // объявлены как props, а не emits — чтобы дождаться Promise из обработчика (submitting, ошибки 422)
    onSubmit: Function as PropType<(data: any) => unknown>,
    onInvalid: Function as PropType<(errors: Record<string, string>) => unknown>,
  },
  setup(props, { slots }) {
    provide(FORM_KEY, props.form);
    const submit = computed(() =>
      props.form.handleSubmit(
        (data) => props.onSubmit?.(data),
        (errors) => props.onInvalid?.(errors),
      ),
    );
    return () => h('form', { novalidate: true, onSubmit: (e: Event) => submit.value(e) }, slots.default?.({ form: props.form }));
  },
});

type Target = HTMLInputElement & HTMLSelectElement;

// <TvField name="email" /> — поле, связанное с формой: input, textarea, select, checkbox, radio, file или свой компонент
export const TvField = defineComponent({
  name: 'TvField',
  props: {
    name: { type: String, required: true },
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'input' },
    type: String,
    // значение варианта для radio и группы чекбоксов
    value: { type: null as unknown as PropType<unknown>, default: undefined },
    multiple: Boolean,
    form: formProp,
  },
  setup(props, { slots }) {
    const form = props.form ?? useFormContext();
    const field = useField(form, () => props.name);
    const set = (v: unknown) => (field.value.value = v);

    return () => {
      const v = field.value.value;
      const base = field.attrs.value;
      const tag = props.as;

      // свой рендер: <TvField name="email" v-slot="{ field, error }">
      if (slots.default && tag !== 'select') {
        return slots.default({
          field: { ...base, modelValue: v, 'onUpdate:modelValue': set },
          value: v,
          setValue: set,
          error: field.error.value,
          errorId: field.errorId.value,
          touched: field.touched.value,
          dirty: field.dirty.value,
        });
      }
      // компонент UI-библиотеки с v-model
      if (typeof tag !== 'string') return h(tag, { ...base, modelValue: v, 'onUpdate:modelValue': set });

      if (tag === 'input' && props.type === 'checkbox') {
        const group = props.value !== undefined;
        const list = Array.isArray(v) ? v : [];
        return h('input', {
          ...base,
          type: 'checkbox',
          value: props.value,
          checked: group ? list.includes(props.value) : !!v,
          onChange: (e: Event) => {
            const checked = (e.target as Target).checked;
            if (!group) return set(checked);
            // текущее значение, а не из последней отрисовки — несколько кликов до перерисовки не теряются
            const now = Array.isArray(field.value.value) ? field.value.value : [];
            set(checked ? [...now, props.value] : now.filter((x) => x !== props.value));
          },
        });
      }
      if (tag === 'input' && props.type === 'radio') {
        return h('input', {
          ...base,
          type: 'radio',
          // у радио-кнопок одного поля одинаковый name, а id должен быть свой
          id: `${base.id}-${String(props.value)}`,
          value: props.value,
          checked: v === props.value,
          onChange: () => set(props.value),
        });
      }
      if (tag === 'input' && props.type === 'file') {
        return h('input', {
          ...base,
          type: 'file',
          multiple: props.multiple,
          onChange: (e: Event) => {
            const files = Array.from((e.target as Target).files ?? []);
            set(props.multiple ? files : (files[0] ?? null));
          },
        });
      }
      if (tag === 'select') {
        return h(
          'select',
          {
            ...base,
            multiple: props.multiple,
            value: props.multiple ? undefined : v,
            onChange: (e: Event) => {
              const el = e.target as Target;
              set(props.multiple ? Array.from(el.selectedOptions, (o) => o.value) : el.value);
            },
          },
          slots.default?.(),
        );
      }
      return h(tag, {
        ...base,
        type: tag === 'input' ? (props.type ?? 'text') : undefined,
        value: v ?? '',
        onInput: (e: Event) => set((e.target as Target).value),
      });
    };
  },
});

// <TvError name="email" /> — текст ошибки поля; id совпадает с aria-describedby поля
export const TvError = defineComponent({
  name: 'TvError',
  props: {
    name: { type: String, required: true },
    as: { type: String, default: 'span' },
    form: formProp,
  },
  setup(props, { slots }) {
    const form = props.form ?? useFormContext();
    return () => {
      const message = form.errors[props.name];
      if (!message) return null;
      const id = `${fieldId(form, props.name)}-error`;
      return slots.default ? slots.default({ message, id }) : h(props.as, { id, role: 'alert' }, message);
    };
  },
});

// <TvFieldArray name="items" v-slot="{ fields, append, remove }"> — список полей
export const TvFieldArray = defineComponent({
  name: 'TvFieldArray',
  props: {
    name: { type: String, required: true },
    form: formProp,
  },
  setup(props, { slots }) {
    const form = props.form ?? useFormContext();
    const array = useFieldArray(form, props.name);
    return () => slots.default?.({ ...array, fields: array.fields.value });
  },
});
