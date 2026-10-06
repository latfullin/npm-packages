<script setup lang="ts">
// Демо tinyval-phone: номер любой страны, иконка флага (SVG грузится по требованию), название страны
import { computed, ref, watch } from 'vue';
import { useData } from 'vitepress';
import { unmask, isComplete, isValid } from 'tinyval-mask';
import { vMask } from 'tinyval-mask/vue';
import { phoneAuto, countryName } from 'tinyval-phone';
import { loadFlag } from 'tinyval-phone/flags';
import { langByHtmlLang } from '../../i18n';

const texts = {
  ru: { label: 'Телефон любой страны', try: 'Попробуйте:', raw: 'Значение без маски', done: 'заполнено', valid: 'верно', invalid: 'проверьте номер', unknown: 'страна не определена', hint: 'Начните с кода страны: +81, +55, +971…', placeholder: '+ код страны и номер', template: 'Шаблон:' },
  en: { label: 'Phone of any country', try: 'Try:', raw: 'Unmasked value', done: 'complete', valid: 'valid', invalid: 'check the number', unknown: 'country not detected', hint: 'Start with the country code: +81, +55, +971…', placeholder: '+ country code and number', template: 'Template:' },
  zh: { label: '任意国家的电话', try: '试试：', raw: '去掉掩码的值', done: '已填写', valid: '正确', invalid: '请检查号码', unknown: '未识别国家', hint: '以国家区号开头：+81、+55、+971……', placeholder: '+ 国家区号和号码', template: '模板：' },
};
const { lang } = useData();
const code = computed(() => langByHtmlLang(lang.value).code);
const t = computed(() => texts[code.value as keyof typeof texts] ?? texts.en);

// без страны по умолчанию: страну задаёт код, который вводит пользователь
const phoneMask = phoneAuto();

const value = ref('');
// символ пустых позиций шаблона — любой, в том числе цифра
const fillers = ['_', '0', '9', '•', 'X'];
const filler = ref('_');
const country = computed(() => phoneMask.country(value.value));
const svg = ref<string>();
watch(
  () => country.value?.code,
  async (c) => {
    svg.value = c ? await loadFlag(c) : undefined;
  },
  { immediate: true },
);

const samples = ['+81 90 1234 5678', '+55 11 96123 4567', '+1 242 359 1234', '+44 7797 712345', '+971 50 123 4567', '+234 802 123 4567'];
</script>

<template>
  <div class="phone-demo">
    <label for="phone-any">{{ t.label }}</label>
    <div class="phone-demo__field">
      <span class="phone-demo__flag" v-html="svg ?? ''" />
      <input id="phone-any" v-model="value" v-mask="{ mask: phoneMask, placeholder: filler }" :placeholder="t.placeholder" inputmode="tel" />
    </div>
    <div class="phone-demo__country">
      {{ country ? `${countryName(country.code, code)} · +${country.dial} · ${country.code}` : value ? t.unknown : t.hint }}
    </div>
    <code class="phone-demo__raw">
      {{ t.raw }}: {{ JSON.stringify(unmask(value, phoneMask)) }}
      <template v-if="isComplete(value, phoneMask)">
        · {{ t.done }} ·
        <span :class="isValid(value, phoneMask) ? 'ok' : 'bad'">{{ isValid(value, phoneMask) ? '✓ ' + t.valid : '✗ ' + t.invalid }}</span>
      </template>
    </code>
    <div class="phone-demo__samples">
      {{ t.template }}
      <button v-for="f in fillers" :key="f" type="button" :class="{ active: f === filler }" @click="filler = f">{{ f }}</button>
    </div>
    <div class="phone-demo__samples">
      {{ t.try }}
      <button v-for="s in samples" :key="s" type="button" @click="value = s">{{ s }}</button>
    </div>
  </div>
</template>

<style scoped>
.phone-demo {
  display: grid;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.phone-demo label {
  font-weight: 500;
}
.phone-demo__field {
  display: flex;
  gap: 8px;
  align-items: center;
}
.phone-demo__flag {
  display: inline-flex;
  width: 30px;
  height: 20px;
  flex: none;
  border-radius: 3px;
  overflow: hidden;
  background: var(--vp-c-default-soft);
}
.phone-demo__flag :deep(svg) {
  width: 100%;
  height: 100%;
}
.phone-demo input {
  flex: 1;
  min-width: 0;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
}
.phone-demo__country,
.phone-demo__raw {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.phone-demo__raw {
  background: none;
  padding: 0;
}
.phone-demo__raw .ok {
  color: var(--vp-c-green-1);
}
.phone-demo__raw .bad {
  color: var(--vp-c-danger-1);
}
.phone-demo__samples {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  font-size: 13px;
}
.phone-demo__samples button {
  padding: 2px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}
.phone-demo__samples button.active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.phone-demo__samples button:hover {
  border-color: var(--vp-c-brand-1);
}
</style>
