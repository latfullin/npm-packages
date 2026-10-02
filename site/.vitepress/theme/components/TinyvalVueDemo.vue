<script setup lang="ts">
// Демо tinyval-vue: форма регистрации на useForm, «сервер» отвечает 422 для занятого email
import { computed } from 'vue';
import { useData } from 'vitepress';
import { object, string, optional, pipe, trim, toLowerCase, minLength, email, sameAs, coerce, integer, min } from 'tinyval';
import { useForm } from 'tinyval-vue';
import ru from 'tinyval/locales/ru';
import en from 'tinyval/locales/en';
import zh from 'tinyval/locales/zh';
import { langByHtmlLang } from '../../i18n';

const texts = {
  ru: {
    name: 'Имя', email: 'Email', age: 'Возраст (необязательно)', password: 'Пароль', confirm: 'Повтор пароля',
    submit: 'Зарегистрироваться', reset: 'Сбросить', taken: 'Этот email уже зарегистрирован',
    hint: 'Попробуйте email taken@mail.ru — «сервер» ответит, что он занят.',
  },
  en: {
    name: 'Name', email: 'Email', age: 'Age (optional)', password: 'Password', confirm: 'Confirm password',
    submit: 'Sign up', reset: 'Reset', taken: 'This email is already registered',
    hint: 'Try taken@mail.ru — the "server" will say it is taken.',
  },
  zh: {
    name: '姓名', email: '邮箱', age: '年龄（选填）', password: '密码', confirm: '确认密码',
    submit: '注册', reset: '重置', taken: '该邮箱已注册',
    hint: '试试 taken@mail.ru —— “服务器”会提示它已被占用。',
  },
};
const messages = { ru, en, zh };

const { lang } = useData();
const code = computed(() => langByHtmlLang(lang.value).code as keyof typeof texts);
const t = computed(() => texts[code.value] ?? texts.en);

const Signup = object({
  name: pipe(string(), trim(), minLength(2)),
  email: pipe(string(), trim(), toLowerCase(), email()),
  age: optional(pipe(coerce.number(), integer(), min(14))),
  password: pipe(string(), minLength(8)),
  confirm: pipe(string(), sameAs('password')),
});

const form = useForm(Signup, {
  initial: { name: '', email: '', age: '', password: '', confirm: '' },
  messages: messages[code.value] ?? en,
});

const submit = form.handleSubmit(async (data) => {
  await new Promise((r) => setTimeout(r, 600));
  if (data.email === 'taken@mail.ru') form.setErrors({ email: [t.value.taken] });
});

const fields = ['name', 'email', 'age', 'password', 'confirm'] as const;
const state = computed(() => ({
  valid: form.valid,
  dirty: form.dirty,
  submitted: form.submitted,
  touched: Object.keys(form.touched),
  data: form.data,
}));
</script>

<template>
  <form class="vue-demo" novalidate @submit="submit">
    <p class="vue-demo__hint">{{ t.hint }}</p>
    <label v-for="f in fields" :key="f">
      {{ t[f] }}
      <input
        v-model="form.values[f]"
        :name="f"
        :type="f === 'password' || f === 'confirm' ? 'password' : 'text'"
        :class="{ invalid: form.errors[f] }"
        @blur="form.touch(f)"
      />
      <span v-if="form.errors[f]" class="vue-demo__error">{{ form.errors[f] }}</span>
    </label>
    <div class="vue-demo__actions">
      <button type="submit" :disabled="form.submitting">{{ form.submitting ? '…' : t.submit }}</button>
      <button type="button" class="secondary" @click="form.reset()">{{ t.reset }}</button>
    </div>
    <pre>{{ JSON.stringify(state, null, 2) }}</pre>
  </form>
</template>

<style scoped>
.vue-demo {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.vue-demo__hint {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.vue-demo label {
  display: grid;
  gap: 4px;
  font-weight: 500;
}
.vue-demo input {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}
.vue-demo input.invalid {
  border-color: var(--vp-c-danger-1);
}
.vue-demo__error {
  font-size: 13px;
  font-weight: 400;
  color: var(--vp-c-danger-1);
}
.vue-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.vue-demo button {
  padding: 6px 16px;
  border-radius: 6px;
  font-weight: 500;
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
}
.vue-demo button.secondary {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}
.vue-demo button:disabled {
  opacity: 0.6;
}
.vue-demo pre {
  margin: 0;
}
</style>
