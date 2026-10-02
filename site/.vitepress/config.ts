import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'kilkenny packages',
  description: 'Маленькие npm-пакеты без зависимостей',
  lang: 'ru-RU',
  themeConfig: {
    nav: [{ text: 'Пакеты', link: '/tinyval/' }],
    sidebar: [
      {
        text: 'Пакеты',
        items: [{ text: 'tinyval', link: '/tinyval/' }],
      },
    ],
    search: { provider: 'local' },
  },
});
