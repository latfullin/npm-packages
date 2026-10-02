import type { PackageMeta } from '../types';

export default {
  name: 'tinyval',
  description: {
    ru: 'Валидация для браузера и сервера. Без зависимостей, ~3 kB, типы из схемы.',
    en: 'Validation for browser and server. Zero dependencies, ~3 kB, types inferred from schemas.',
    zh: '适用于浏览器和服务端的数据校验。零依赖，约 3 kB，类型从 Schema 推导。',
  },
  intro: { ru: 'Введение', en: 'Introduction', zh: '介绍' },
  sections: [
    {
      dir: 'guide',
      title: { ru: 'Руководство', en: 'Guide', zh: '指南' },
      pages: [
        { slug: 'result', title: { ru: 'Результат проверки', en: 'Validation result', zh: '校验结果' } },
        { slug: 'empty-values', title: { ru: 'Пустые значения', en: 'Empty values', zh: '空值' } },
        { slug: 'messages', title: { ru: 'Сообщения и локализация', en: 'Messages & i18n', zh: '错误信息与国际化' } },
        { slug: 'typescript', title: 'TypeScript' },
        { slug: 'custom-rules', title: { ru: 'Свои правила и схемы', en: 'Custom rules & schemas', zh: '自定义规则与 Schema' } },
        { slug: 'custom-lang', title: { ru: 'Свой lang-файл', en: 'Custom lang file', zh: '自定义语言文件' } },
        { slug: 'standard-schema', title: 'Standard Schema' },
      ],
    },
    {
      dir: 'api',
      title: { ru: 'Функции', en: 'Functions', zh: '函数' },
      pages: ['validate', 'validateAsync', 'parse', 'parseAsync', 'ValidationError', 'flatten', 'setMessages', 'setLabels', 'createSchema'],
    },
    {
      dir: 'schemas',
      title: { ru: 'Схемы', en: 'Schemas', zh: 'Schema' },
      pages: ['string', 'number', 'boolean', 'date', 'literal', 'oneOf', 'enumOf', 'unknown', 'object', 'array', 'tuple', 'record', 'union', 'variant', 'lazy', 'optional', 'nullable', 'fallback', 'label', 'transform', 'preprocess', 'coerce'],
    },
    {
      dir: 'objects',
      title: { ru: 'Операции с объектами', en: 'Object helpers', zh: '对象操作' },
      pages: ['partial', 'pick', 'omit', 'extend'],
    },
    {
      dir: 'actions',
      title: { ru: 'Правила и преобразования', en: 'Rules & transforms', zh: '规则与转换' },
      pages: ['pipe', 'minLength', 'maxLength', 'length', 'min', 'max', 'integer', 'pattern', 'email', 'sameAs', 'trim', 'toLowerCase', 'toUpperCase', 'check', 'checkAsync'],
    },
  ],
} satisfies PackageMeta;
