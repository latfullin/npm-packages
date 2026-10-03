<script setup lang="ts">
// Демо tinyval-mask: телефон с выбором страны, карта с платёжной системой, сумма, дата, свой шаблон
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import { unmask, isComplete, numberMask } from 'tinyval-mask';
import { phone, card, cardBrand, money, date, carPlate, type PhoneCountry } from 'tinyval-mask/presets';
import { vMask } from 'tinyval-mask/vue';
import { langByHtmlLang } from '../../i18n';

const texts = {
  ru: { phone: 'Телефон', card: 'Номер карты', money: 'Сумма', date: 'Дата', plate: 'Госномер', number: 'Число с минусом', raw: 'Значение без маски', done: 'заполнено' },
  en: { phone: 'Phone', card: 'Card number', money: 'Amount', date: 'Date', plate: 'Car plate (RU)', number: 'Signed number', raw: 'Unmasked value', done: 'complete' },
  zh: { phone: '电话', card: '卡号', money: '金额', date: '日期', plate: '车牌（俄罗斯）', number: '带负号的数字', raw: '去掉掩码的值', done: '已填写' },
};
const { lang } = useData();
const t = computed(() => texts[langByHtmlLang(lang.value).code as keyof typeof texts] ?? texts.en);

const countries: PhoneCountry[] = ['ru', 'kz', 'by', 'ua', 'uz', 'us'];
const country = ref<PhoneCountry>('ru');
const phoneMask = computed(() => phone(country.value));

const fields = {
  card: card(),
  money: money({ currency: '₽' }),
  date: date(),
  plate: carPlate(),
  number: numberMask({ negative: true, precision: 3 }),
};
const values = ref({ phone: '', card: '', money: '', date: '', plate: '', number: '' });
const brand = computed(() => cardBrand(values.value.card));
// у масок фиксированной длины — видимый шаблон с заполнителем _
const withTemplate = ['phone', 'card', 'date', 'plate'];
const rows = computed(() =>
  [{ key: 'phone', mask: phoneMask.value }, ...Object.entries(fields).map(([key, mask]) => ({ key, mask }))].map((r) => ({
    ...r,
    binding: withTemplate.includes(r.key) ? { mask: r.mask, placeholder: '_' } : r.mask,
  })),
);
</script>

<template>
  <div class="mask-demo">
    <div v-for="row in rows" :key="row.key" class="mask-demo__row">
      <label :for="`mask-${row.key}`">{{ t[row.key as keyof typeof t] }}</label>
      <div class="mask-demo__field">
        <select v-if="row.key === 'phone'" v-model="country" aria-label="country">
          <option v-for="c in countries" :key="c" :value="c">{{ c.toUpperCase() }}</option>
        </select>
        <input :id="`mask-${row.key}`" v-model="values[row.key as keyof typeof values]" v-mask="row.binding" inputmode="text" />
        <span v-if="row.key === 'card' && brand !== 'unknown'" class="mask-demo__brand">{{ brand }}</span>
      </div>
      <code class="mask-demo__raw">
        {{ t.raw }}: {{ JSON.stringify(unmask(values[row.key as keyof typeof values], row.mask)) }}
        <template v-if="isComplete(values[row.key as keyof typeof values], row.mask)"> · ✓ {{ t.done }}</template>
      </code>
    </div>
  </div>
</template>

<style scoped>
.mask-demo {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.mask-demo__row {
  display: grid;
  gap: 4px;
}
.mask-demo__row label {
  font-weight: 500;
}
.mask-demo__field {
  display: flex;
  gap: 8px;
  align-items: center;
}
.mask-demo input,
.mask-demo select {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
}
.mask-demo input {
  flex: 1;
  min-width: 0;
}
.mask-demo__brand {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}
.mask-demo__raw {
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: none;
  padding: 0;
}
</style>
