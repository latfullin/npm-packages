import type { LangFile } from './types';

export default {
  code: 'ru',
  label: 'Русский',
  lang: 'ru-RU',
  description: 'Маленькие npm-пакеты без зависимостей',
  nav: { packages: 'Пакеты' },
  home: { tagline: 'Маленькие, быстрые npm-пакеты без зависимостей', action: 'Смотреть пакеты' },
  theme: {
    outline: 'На этой странице',
    prev: 'Предыдущая',
    next: 'Следующая',
    returnToTop: 'Наверх',
    menu: 'Меню',
    darkModeSwitch: 'Тема',
    lightModeTitle: 'Светлая тема',
    darkModeTitle: 'Тёмная тема',
    langMenu: 'Язык',
    notFound: { title: 'Страница не найдена', quote: 'Такой страницы нет.', linkText: 'На главную' },
  },
  search: {
    button: 'Поиск',
    noResults: 'Ничего не найдено',
    reset: 'Сбросить',
    select: 'выбрать',
    navigate: 'навигация',
    close: 'закрыть',
  },
  docs: { signature: 'Сигнатура', params: 'Параметры', codes: 'Коды ошибок', examples: 'Примеры', example: 'Пример', see: 'См. также', notes: 'Особенности' },
  demo: {
    version: 'Версия',
    local: 'локальная',
    unpublished: 'пакет ещё не опубликован на npm',
    loading: 'Загрузка…',
    failed: 'Не удалось загрузить',
  },
} satisfies LangFile;
