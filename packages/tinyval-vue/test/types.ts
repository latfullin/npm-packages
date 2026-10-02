// Проверка вывода типов: файл только компилируется (tsc -p test), не запускается
import { coerce, object, string } from 'tinyval';
import { useForm } from '../dist/index.js';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
const expect = <T extends true>() => {};

const form = useForm(object({ name: string(), age: coerce.number() }), { initial: { name: '', age: '' } });
expect<Equal<typeof form.values, { name: string; age: string }>>();
expect<Equal<typeof form.data, { name: string; age: number } | undefined>>();
form.handleSubmit((data) => {
  expect<Equal<typeof data, { name: string; age: number }>>();
});
// @ts-expect-error — initial обязателен
useForm(object({ name: string() }), {});

// ---------- useField, useFieldArray, changes
import { array, number } from 'tinyval';
import { useField, useFieldArray } from '../dist/index.js';

const f2 = useForm(object({ age: number(), items: array(object({ title: string() })) }), {
  initial: { age: 0, items: [{ title: '' }] },
});
const age = useField<number>(f2, 'age');
expect<Equal<typeof age.value.value, number>>();
const rows = useFieldArray<{ title: string }>(f2, 'items');
rows.append({ title: 'x' });
// @ts-expect-error — элемент другого типа
rows.append({ name: 'x' });
expect<Equal<typeof f2.changes, { age?: number; items?: { title: string }[] }>>();
