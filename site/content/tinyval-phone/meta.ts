import type { PackageMeta } from '../types';

export default {
  name: 'tinyval-phone',
  description: {
    ru: 'Маски телефонов всех стран для tinyval-mask: определение страны по коду, форматы 245 стран, иконки флагов в SVG.',
    en: 'Phone masks for every country for tinyval-mask: country detection by code, formats of 245 countries, SVG flag icons.',
    zh: '适用于 tinyval-mask 的全球电话掩码：按区号识别国家、245 个国家的格式、SVG 国旗图标。',
  },
  intro: { ru: 'Введение', en: 'Introduction', zh: '介绍' },
  sections: [
    {
      dir: 'guide',
      title: { ru: 'Руководство', en: 'Guide', zh: '指南' },
      pages: [
        { slug: 'countries', title: { ru: 'Страны и форматы', en: 'Countries & formats', zh: '国家与格式' } },
        { slug: 'flags', title: { ru: 'Иконки флагов', en: 'Flag icons', zh: '国旗图标' } },
        { slug: 'custom', title: { ru: 'Свои страны и флаги', en: 'Your own countries & flags', zh: '自定义国家和国旗' } },
      ],
    },
    {
      dir: 'api',
      title: { ru: 'API', en: 'API', zh: 'API' },
      pages: ['phoneAuto', { slug: 'phone', title: 'phone, detectCountry, phoneCountries' }, 'loadFlag'],
    },
  ],
} satisfies PackageMeta;
