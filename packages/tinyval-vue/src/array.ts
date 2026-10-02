// useFieldArray — список полей: устойчивые ключи для v-for и операции, которые не сдвигают touched на соседние строки
import { computed, ref, watch, type ComputedRef } from 'vue';
import { isForm, useFormContext } from './context.js';
import type { Form } from './form.js';
import { getPath, setPath } from './utils.js';

export interface ArrayField<T> {
  key: number;
  index: number;
  path: string;
  value: T;
}

export interface FieldArray<T> {
  fields: ComputedRef<ArrayField<T>[]>;
  append(value: T): void;
  prepend(value: T): void;
  insert(index: number, value: T): void;
  remove(index: number): void;
  move(from: number, to: number): void;
  swap(a: number, b: number): void;
  replace(values: T[]): void;
}

let nextKey = 0;

// useFieldArray('items') — форма из контекста; useFieldArray(form, 'items') — явно
export function useFieldArray<T = unknown>(path: string): FieldArray<T>;
export function useFieldArray<T = unknown>(form: Form<any, any>, path: string): FieldArray<T>;
export function useFieldArray<T = unknown>(a: Form<any, any> | string, b?: string): FieldArray<T> {
  const form = isForm(a) ? a : useFormContext();
  const path = (isForm(a) ? b : a) as string;
  const list = (): T[] => {
    let arr = getPath(form.values, path) as T[] | undefined;
    if (!Array.isArray(arr)) {
      setPath(form.values, path, []);
      arr = getPath(form.values, path) as T[];
    }
    return arr;
  };
  const keys = ref<number[]>([]);
  // пока работает своя операция, ключи уже выставлены вручную — подстройка по длине не нужна
  let own = false;
  const mutate = (fn: () => void) => {
    own = true;
    try {
      fn();
    } finally {
      own = false;
    }
  };

  // если массив поменяли напрямую (form.values.items.push), ключи подстраиваются по длине
  watch(
    () => (getPath(form.values, path) as T[] | undefined)?.length ?? 0,
    (len) => {
      if (own) return;
      while (keys.value.length < len) keys.value.push(nextKey++);
      if (keys.value.length > len) keys.value.length = len;
    },
    { immediate: true, flush: 'sync' },
  );

  // Переносит отметки touched вслед за строками: map(старый индекс) → новый индекс или undefined (строка удалена)
  function remap(map: (i: number) => number | undefined) {
    const prefix = `${path}.`;
    const moved: Record<string, boolean> = {};
    for (const key of Object.keys(form.touched)) {
      if (!key.startsWith(prefix)) continue;
      const [index, ...rest] = key.slice(prefix.length).split('.');
      if (!/^\d+$/.test(index)) continue;
      const to = map(Number(index));
      if (to !== undefined) moved[[path, to, ...rest].join('.')] = form.touched[key];
      delete form.touched[key];
    }
    Object.assign(form.touched, moved);
  }

  function splice(start: number, remove: number, ...items: T[]) {
    mutate(() => {
      keys.value.splice(start, remove, ...items.map(() => nextKey++));
      list().splice(start, remove, ...items);
    });
  }

  return {
    fields: computed(() =>
      ((getPath(form.values, path) as T[] | undefined) ?? []).map((value, index) => ({
        key: keys.value[index],
        index,
        path: `${path}.${index}`,
        value,
      })),
    ),
    append: (value) => splice(list().length, 0, value),
    prepend(value) {
      remap((i) => i + 1);
      splice(0, 0, value);
    },
    insert(index, value) {
      remap((i) => (i >= index ? i + 1 : i));
      splice(index, 0, value);
    },
    remove(index) {
      remap((i) => (i === index ? undefined : i > index ? i - 1 : i));
      splice(index, 1);
    },
    move(from, to) {
      remap((i) => {
        if (i === from) return to;
        if (from < to && i > from && i <= to) return i - 1;
        if (from > to && i >= to && i < from) return i + 1;
        return i;
      });
      mutate(() => {
        const [key] = keys.value.splice(from, 1);
        keys.value.splice(to, 0, key);
        const arr = list();
        const [item] = arr.splice(from, 1);
        arr.splice(to, 0, item);
      });
    },
    swap(a, b) {
      remap((i) => (i === a ? b : i === b ? a : i));
      const k = keys.value;
      [k[a], k[b]] = [k[b], k[a]];
      const arr = list();
      [arr[a], arr[b]] = [arr[b], arr[a]];
    },
    replace(values) {
      remap(() => undefined);
      splice(0, list().length, ...values);
    },
  };
}
