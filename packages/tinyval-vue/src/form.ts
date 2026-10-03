// useForm — состояние формы: значения для v-model, ошибки, touched, отправка, ошибки сервера
import * as Vue from 'vue';
import { computed, getCurrentInstance, getCurrentScope, onScopeDispose, provide, reactive, ref, shallowRef, toRaw, watch } from 'vue';
import { validateAny, type Infer, type Options, type Result, type Schema } from 'tinyval';
import { FORM_KEY } from './context.js';
import { changes, clone, getPath, setPath, snapshot, within } from './utils.js';

type DeepPartial<T> = T extends Date | unknown[] ? T : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export interface FormOptions<V> extends Omit<Options, 'all' | 'abortEarly'> {
  // Начальные значения полей — то, что привязывается к v-model
  initial: V;
  // Когда показывать ошибки: после ухода с поля (по умолчанию), сразу при вводе или только после отправки
  mode?: 'blur' | 'input' | 'submit';
  // Задержка перед асинхронными проверками при вводе, мс
  debounce?: number;
  // Ставить фокус на первое поле с ошибкой при неудачной отправке (нужен атрибут name у полей)
  focusOnError?: boolean;
  // Достаёт ошибки полей из исключения в handleSubmit. По умолчанию понимает ответ 422 от Laravel (axios, ofetch)
  extractErrors?: (error: unknown) => Record<string, string | string[]> | null | undefined;
  // id формы — основа для id полей. По умолчанию useId() (Vue 3.5+) или счётчик
  id?: string;
}

export interface FieldBinding {
  modelValue: unknown;
  'onUpdate:modelValue': (value: unknown) => void;
  onBlur: () => void;
}

export interface Form<V, T> {
  readonly id: string;
  values: V;
  // Ошибки, которые пора показать (с учётом mode), и все текущие ошибки
  errors: Record<string, string>;
  allErrors: Record<string, string>;
  touched: Record<string, boolean>;
  valid: boolean;
  dirty: boolean;
  // Только изменённые поля — например, для PATCH
  changes: DeepPartial<V>;
  validating: boolean;
  submitting: boolean;
  submitted: boolean;
  // Сколько раз пытались отправить; удалась ли последняя отправка
  submitCount: number;
  submitSucceeded: boolean;
  // Последние проверенные данные — то, что уйдёт в handleSubmit
  data: T | undefined;
  touch(path: string): void;
  isDirty(path: string): boolean;
  bind(path: string): FieldBinding;
  setValue(path: string, value: unknown): void;
  setValues(values: DeepPartial<V>): void;
  setErrors(errors: Record<string, string | string[]>): void;
  // Ошибка одного поля (как ошибка сервера: исчезнет при изменении поля); без текста — убрать
  setFieldError(path: string, message?: string): void;
  // Скрыть ошибки поля (или всей формы) до следующего ухода с поля / отправки
  clearErrors(path?: string): void;
  setTouched(path: string, touched?: boolean): void;
  // Вернуть поле к начальному значению; с value — задать новое начальное значение
  resetField(path: string, value?: unknown): void;
  validateField(path: string): Promise<boolean>;
  // Без аргументов — вся форма; с путями — только эти поля (шаг пошаговой формы)
  validate(paths?: string[]): Promise<boolean>;
  handleSubmit(
    onValid: (data: T) => unknown,
    onInvalid?: (errors: Record<string, string>) => unknown,
  ): (event?: Event) => Promise<void>;
  reset(values?: V): void;
}

let uid = 0;

// Ошибки полей из ответа 422 (Laravel): axios — error.response, ofetch — error.data; ValidationError из tinyval
export function defaultExtractErrors(error: unknown): Record<string, string | string[]> | undefined {
  const e = error as { name?: string; status?: number; statusCode?: number; errors?: unknown; data?: { errors?: unknown }; response?: { status?: number; data?: { errors?: unknown } } };
  if (!e || typeof e !== 'object') return;
  const status = e.response?.status ?? e.statusCode ?? e.status;
  const errors = e.response?.data?.errors ?? e.data?.errors;
  if (status === 422 && errors && typeof errors === 'object') return errors as Record<string, string | string[]>;
  if (e.name === 'ValidationError' && e.errors && typeof e.errors === 'object') return e.errors as Record<string, string>;
}

export function useForm<S extends Schema<any>, V extends object>(schema: S, options: FormOptions<V>): Form<V, Infer<S>> {
  const {
    initial,
    mode = 'blur',
    debounce = 300,
    focusOnError = true,
    extractErrors = defaultExtractErrors,
    id = (getCurrentInstance() && (Vue as { useId?: () => string }).useId?.()) || `tv-${++uid}`,
    ...validateOptions
  } = options;
  let start = clone(initial);
  const startVersion = ref(0);
  const values = reactive(clone(initial)) as V;
  const touched = reactive<Record<string, boolean>>({});
  const result = shallowRef<Result<Infer<S>>>();
  // Ошибки сервера и значение поля в момент, когда их получили: при изменении поля ошибка убирается
  const server = ref<Record<string, { message: string; value: string }>>({});
  const submitted = ref(false);
  const submitting = ref(false);
  const validating = ref(false);
  const submitCount = ref(0);
  const submitSucceeded = ref(false);
  let isAsync = false;
  let version = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function check(): Promise<Result<Infer<S>>> {
    const v = ++version;
    let r = validateAny(schema, toRaw(values), validateOptions);
    if (r instanceof Promise) {
      isAsync = true;
      validating.value = true;
      try {
        r = await r;
      } finally {
        if (v === version) validating.value = false;
      }
    }
    // ответ устаревшей проверки не перезаписывает новый
    if (v === version) result.value = r;
    return r;
  }

  function scheduleCheck() {
    clearTimeout(timer);
    if (isAsync && debounce > 0) {
      validating.value = true;
      timer = setTimeout(() => void check().catch(console.error), debounce);
    } else void check().catch(console.error);
  }

  const dirty = computed(() => (startVersion.value, snapshot(values) !== snapshot(start)));

  watch(
    values,
    () => {
      for (const key of Object.keys(server.value)) {
        if (snapshot(getPath(values, key)) !== server.value[key].value) {
          const { [key]: _, ...rest } = server.value;
          server.value = rest;
        }
      }
      scheduleCheck();
    },
    { deep: true, immediate: true },
  );

  if (getCurrentScope()) {
    onScopeDispose(() => clearTimeout(timer));
  }

  const isTouched = (key: string) => Object.keys(touched).some((t) => touched[t] && within(key, t));
  const isDirty = (path: string) => (startVersion.value, snapshot(getPath(values, path)) !== snapshot(getPath(start, path)));

  function visible(key: string): boolean {
    if (submitted.value) return true;
    if (mode === 'submit') return false;
    return isTouched(key) || (mode === 'input' && key !== '' && isDirty(key));
  }

  const serverErrors = computed(() =>
    Object.fromEntries(Object.entries(server.value).map(([k, v]) => [k, v.message])),
  );
  const allErrors = computed(() => ({ ...result.value?.errors, ...serverErrors.value }));
  const errors = computed(() => {
    const out: Record<string, string> = {};
    for (const [k, m] of Object.entries(result.value?.errors ?? {})) if (visible(k)) out[k] = m;
    return { ...out, ...serverErrors.value };
  });

  async function runValidate(paths?: string[]): Promise<boolean> {
    clearTimeout(timer);
    if (paths) for (const p of paths) touched[p] = true;
    else submitted.value = true;
    const r = await check();
    const keys = [...Object.keys(r.errors), ...Object.keys(server.value)];
    return !keys.some((k) => !paths || paths.some((p) => within(k, p)));
  }

  // Фокус на первое по порядку в разметке поле с ошибкой
  function focusFirst(root: unknown) {
    const form = root as { querySelectorAll?: (s: string) => ArrayLike<HTMLElement> } | null;
    if (!form?.querySelectorAll) return;
    const el = Array.from(form.querySelectorAll('[name]')).find((e) => e.getAttribute('name')! in errors.value);
    el?.focus();
  }

  // Ошибки сервера: { email: 'Занят' } или формат Laravel { email: ['Занят'] }
  function setErrors(errs: Record<string, string | string[]>) {
    const next: Record<string, { message: string; value: string }> = {};
    for (const [k, m] of Object.entries(errs)) {
      const message = Array.isArray(m) ? m[0] : m;
      if (message) next[k] = { message, value: snapshot(getPath(values, k)) };
    }
    server.value = next;
  }

  const form = reactive({
    id,
    values,
    errors,
    allErrors,
    touched,
    valid: computed(() => !!result.value?.valid && !Object.keys(server.value).length),
    dirty,
    changes: computed(() => (startVersion.value, changes(values, start) as DeepPartial<V>)),
    validating,
    submitting,
    submitted,
    submitCount,
    submitSucceeded,
    data: computed(() => (result.value?.valid ? result.value.data : undefined)),
    touch(path: string) {
      touched[path] = true;
    },
    isDirty,
    bind(path: string): FieldBinding {
      return {
        modelValue: getPath(values, path),
        'onUpdate:modelValue': (v: unknown) => setPath(values, path, v),
        onBlur: () => {
          touched[path] = true;
        },
      };
    },
    setValue(path: string, value: unknown) {
      setPath(values, path, value);
    },
    setValues(next: DeepPartial<V>) {
      Object.assign(values, clone(next));
    },
    setErrors,
    setFieldError(path: string, message?: string) {
      const { [path]: _, ...rest } = server.value;
      server.value = message ? { ...rest, [path]: { message, value: snapshot(getPath(values, path)) } } : rest;
    },
    clearErrors(path?: string) {
      server.value = Object.fromEntries(Object.entries(server.value).filter(([k]) => path !== undefined && !within(k, path)));
      for (const k of Object.keys(touched)) if (path === undefined || within(k, path)) delete touched[k];
      if (path === undefined) submitted.value = false;
    },
    setTouched(path: string, value = true) {
      if (value) touched[path] = true;
      else delete touched[path];
    },
    resetField(path: string, value?: unknown) {
      if (arguments.length > 1) {
        setPath(start, path, clone(value));
        startVersion.value++;
      }
      setPath(values, path, clone(getPath(start, path)));
      delete touched[path];
      const { [path]: _, ...rest } = server.value;
      server.value = rest;
    },
    validateField: (path: string) => runValidate([path]),
    validate: runValidate,
    handleSubmit(onValid: (data: Infer<S>) => unknown, onInvalid?: (errors: Record<string, string>) => unknown) {
      return async (event?: Event) => {
        // currentTarget доступен только синхронно — запоминаем форму до await
        const root = event?.currentTarget ?? event?.target;
        event?.preventDefault?.();
        server.value = {};
        submitting.value = true;
        submitCount.value++;
        submitSucceeded.value = false;
        try {
          if (await runValidate()) {
            try {
              await onValid(result.value!.data as Infer<S>);
            } catch (error) {
              // ответ 422 и подобные — раскладываем ошибки по полям вместо исключения
              const errs = extractErrors(error);
              if (!errs) throw error;
              setErrors(errs);
              if (focusOnError) focusFirst(root);
              return;
            }
            // сервер принял данные (не вернул ошибки) — текущие значения считаются сохранёнными
            if (!Object.keys(server.value).length) {
              start = clone(toRaw(values));
              startVersion.value++;
              submitSucceeded.value = true;
            }
          } else {
            if (focusOnError) focusFirst(root);
            await onInvalid?.(errors.value);
          }
        } finally {
          submitting.value = false;
        }
      };
    },
    reset(next?: V) {
      clearTimeout(timer);
      start = clone(next ?? initial);
      startVersion.value++;
      const target = values as Record<string, unknown>;
      for (const k of Object.keys(target)) delete target[k];
      Object.assign(target, clone(start));
      for (const k of Object.keys(touched)) delete touched[k];
      server.value = {};
      submitted.value = false;
      submitSucceeded.value = false;
    },
  }) as unknown as Form<V, Infer<S>>;

  // вложенные компоненты получат форму через useFormContext() / useField('path')
  if (getCurrentInstance()) provide(FORM_KEY, form);
  return form;
}
