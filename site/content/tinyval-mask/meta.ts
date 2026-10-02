import type { PackageMeta } from '../types';

export default {
  name: 'tinyval-mask',
  description: {
    ru: 'Маски ввода без зависимостей: телефоны, карты, даты, суммы, документы РФ, свои шаблоны. ~1 kB.',
    en: 'Zero-dependency input masks: phones, cards, dates, amounts, documents, custom patterns. ~1 kB.',
    zh: '零依赖的输入掩码：电话、银行卡、日期、金额、证件、自定义模板。约 1 kB。',
  },
  intro: { ru: 'Введение', en: 'Introduction', zh: '介绍' },
  sections: [
    {
      dir: 'guide',
      title: { ru: 'Руководство', en: 'Guide', zh: '指南' },
      pages: [
        { slug: 'patterns', title: { ru: 'Шаблоны', en: 'Patterns', zh: '模板' } },
        { slug: 'values', title: { ru: 'Что возвращают маски', en: 'What masks return', zh: '掩码返回什么' } },
        { slug: 'browser', title: { ru: 'Поле ввода', en: 'Input field', zh: '输入框' } },
        { slug: 'vue', title: 'Vue' },
        { slug: 'validation', title: { ru: 'Маски и валидация', en: 'Masks & validation', zh: '掩码与校验' } },
      ],
    },
    {
      dir: 'api',
      title: { ru: 'API', en: 'API', zh: 'API' },
      pages: [
        { slug: 'presets', title: { ru: 'Готовые маски', en: 'Ready-made masks', zh: '预设掩码' } },
        'createMask',
        { slug: 'mask', title: 'mask, unmask, isComplete' },
        'numberMask',
        'attach',
        'vMask',
      ],
    },
  ],
} satisfies PackageMeta;
