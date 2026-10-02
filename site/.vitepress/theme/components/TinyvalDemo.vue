<script setup lang="ts">
// Демо tinyval: форма регистрации, ошибки на языке страницы
import { ref, computed } from 'vue';
import { useData } from 'vitepress';
import pkg from 'tinyval/package.json';
import ru from 'tinyval/locales/ru';
import en from 'tinyval/locales/en';
import zh from 'tinyval/locales/zh';
import { langByHtmlLang } from '../../i18n';
import PackageDemo from './PackageDemo.vue';

const messages: Record<string, typeof en> = { ru, en, zh };

const labels: Record<string, Record<string, string>> = {
  ru: { name: 'Имя', email: 'Email', age: 'Возраст (необязательно)', password: 'Пароль', confirm: 'Повтор пароля' },
  en: { name: 'Name', email: 'Email', age: 'Age (optional)', password: 'Password', confirm: 'Confirm password' },
  zh: { name: '姓名', email: '邮箱', age: '年龄（选填）', password: '密码', confirm: '确认密码' },
};

const { lang } = useData();
const code = computed(() => langByHtmlLang(lang.value).code);
const l = computed(() => labels[code.value] ?? labels.en);

const loadLocal = () => import('tinyval');

const form = ref({ name: '', email: '', age: '', password: '', confirm: '' });

// lib — модуль выбранной версии пакета
function check(lib: any) {
  const { object, string, optional, pipe, trim, minLength, email, min, max, integer, sameAs, coerce } = lib;
  const schema = object({
    name: pipe(string(), trim(), minLength(2)),
    email: pipe(string(), trim(), email()),
    age: optional(pipe(coerce.number(), integer(), min(0), max(150))),
    password: pipe(string(), minLength(8)),
    confirm: pipe(string(), sameAs('password')),
  });
  const { valid, data, errors } = lib.validate(schema, form.value, { messages: messages[code.value] ?? en });
  return JSON.stringify({ valid, data, errors }, null, 2);
}
</script>

<template>
  <PackageDemo name="tinyval" :local-version="pkg.version" :load-local="loadLocal" v-slot="{ lib }">
    <label>{{ l.name }} <input v-model="form.name" /></label>
    <label>{{ l.email }} <input v-model="form.email" /></label>
    <label>{{ l.age }} <input v-model="form.age" /></label>
    <label>{{ l.password }} <input v-model="form.password" type="password" /></label>
    <label>{{ l.confirm }} <input v-model="form.confirm" type="password" /></label>
    <pre>{{ check(lib) }}</pre>
  </PackageDemo>
</template>
