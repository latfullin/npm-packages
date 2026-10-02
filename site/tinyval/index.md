<script setup>
import { ref } from 'vue';
import pkg from 'tinyval/package.json';

const loadLocal = () => import('tinyval');

const form = ref({ name: '', email: '' });

// lib — модуль выбранной версии пакета
const check = (lib) =>
  lib.validate(form.value, {
    name: [lib.required(), lib.string(), lib.minLength(2)],
    email: [lib.required(), lib.email()],
  });
</script>

# tinyval

Маленькая и быстрая валидация без зависимостей.

## Установка

```bash
npm install tinyval
```

## Использование

```ts
import { validate, required, string, minLength, email } from 'tinyval';

const { valid, errors } = validate(data, {
  name: [required(), string(), minLength(2)],
  email: [required(), email()],
});
```

## Попробовать

<PackageDemo name="tinyval" :local-version="pkg.version" :load-local="loadLocal" v-slot="{ lib }">
  <label>Имя <input v-model="form.name" placeholder="Ivan" /></label>
  <label>Email <input v-model="form.email" placeholder="ivan@mail.ru" /></label>
  <pre>{{ JSON.stringify(check(lib), null, 2) }}</pre>
</PackageDemo>

## Правила

| Правило | Описание |
| --- | --- |
| `required(msg?)` | Значение не `undefined`, `null` и не `''` |
| `string(msg?)` | Строка |
| `number(msg?)` | Число (не `NaN`) |
| `minLength(n, msg?)` / `maxLength(n, msg?)` | Длина строки |
| `min(n, msg?)` / `max(n, msg?)` | Границы числа |
| `pattern(re, msg?)` | Строка соответствует регулярному выражению |
| `email(msg?)` | Корректный email |

## Своё правило

Правило — функция, которая возвращает текст ошибки или `null`:

```ts
const even = (msg = 'Должно быть чётным') => (v: unknown) =>
  typeof v === 'number' && v % 2 !== 0 ? msg : null;
```
