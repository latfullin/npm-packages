import type { PackageMeta } from '../types';

export default {
  name: 'tinyval-vue',
  description: {
    ru: 'Формы во Vue 3 на схемах tinyval: composable и компоненты, списки полей, шаги, черновики, ответы 422. ~2 kB.',
    en: 'Vue 3 forms on tinyval schemas: composables and components, field arrays, steps, drafts, 422 responses. ~2 kB.',
    zh: '基于 tinyval Schema 的 Vue 3 表单：composable 与组件、字段列表、分步、草稿、422 响应。约 2 kB。',
  },
  intro: { ru: 'Введение', en: 'Introduction', zh: '介绍' },
  sections: [
    {
      dir: 'guide',
      title: { ru: 'Руководство', en: 'Guide', zh: '指南' },
      pages: [
        { slug: 'data', title: { ru: 'Данные формы', en: 'Form data', zh: '表单数据' } },
        { slug: 'fields', title: { ru: 'Поля формы', en: 'Form fields', zh: '表单字段' } },
        { slug: 'errors', title: { ru: 'Ошибки', en: 'Errors', zh: '错误' } },
        { slug: 'async', title: { ru: 'Асинхронные проверки', en: 'Async checks', zh: '异步检查' } },
        { slug: 'steps', title: { ru: 'Пошаговые формы', en: 'Multi-step forms', zh: '分步表单' } },
        { slug: 'editing', title: { ru: 'Редактирование и черновики', en: 'Editing & drafts', zh: '编辑与草稿' } },
        { slug: 'ui-libraries', title: { ru: 'UI-библиотеки', en: 'UI libraries', zh: 'UI 组件库' } },
      ],
    },
    {
      dir: 'api',
      title: { ru: 'API', en: 'API', zh: 'API' },
      pages: [
        'useForm',
        { slug: 'components', title: { ru: 'Компоненты', en: 'Components', zh: '组件' } },
        'useField',
        'useFieldArray',
        'useDraft',
        'useLeaveGuard',
      ],
    },
  ],
} satisfies PackageMeta;
