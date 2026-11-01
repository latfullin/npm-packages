import path from 'node:path';
import { defineConfig, type DefaultTheme, type HeadConfig, type LocaleConfig, type Plugin } from 'vitepress';
import { langs, prefix, type LangFile } from './i18n';
import { contentDir, sidebar } from './docs/content';
import { packages } from '../content';

function themeConfig(t: LangFile): DefaultTheme.Config {
  const base = prefix(t.code);
  return {
    nav: [{ text: t.nav.packages, items: packages.map((p) => ({ text: p.name, link: `${base}/${p.name}/` })) }],
    sidebar: Object.fromEntries(packages.map((p) => [`${base}/${p.name}/`, sidebar(p, t.code)])),
    outline: { level: [2, 3], label: t.theme.outline },
    docFooter: { prev: t.theme.prev, next: t.theme.next },
    returnToTopLabel: t.theme.returnToTop,
    sidebarMenuLabel: t.theme.menu,
    darkModeSwitchLabel: t.theme.darkModeSwitch,
    lightModeSwitchTitle: t.theme.lightModeTitle,
    darkModeSwitchTitle: t.theme.darkModeTitle,
    langMenuLabel: t.theme.langMenu,
    notFound: t.theme.notFound,
  };
}

const locales: LocaleConfig<DefaultTheme.Config> = {};
const searchLocales: Record<string, object> = {};

for (const t of langs) {
  const key = prefix(t.code) ? t.code : 'root';
  locales[key] = {
    label: t.label,
    lang: t.lang,
    link: `${prefix(t.code)}/`,
    description: t.description,
    themeConfig: themeConfig(t),
  };
  searchLocales[key] = {
    translations: {
      button: { buttonText: t.search.button, buttonAriaLabel: t.search.button },
      modal: {
        noResultsText: t.search.noResults,
        resetButtonTitle: t.search.reset,
        footer: { selectText: t.search.select, navigateText: t.search.navigate, closeText: t.search.close },
      },
    },
  };
}

// VitePress не отслеживает .md из content/: при их изменении пересобираем страницы через [page].paths.ts
const contentReload = (): Plugin => ({
  name: 'content-reload',
  handleHotUpdate({ file, server }) {
    if (file.startsWith(contentDir) && file.endsWith('.md')) {
      server.watcher.emit('change', path.resolve(__dirname, '../[page].paths.ts'));
      return [];
    }
  },
});

// Яндекс.Метрика: только в бою, с номером счётчика из METRIKA_ID.
// Переходы между страницами считает theme/metrika.ts — VitePress меняет их без перезагрузки.
const metrikaId = process.env.METRIKA_ID;
const metrika: HeadConfig[] = metrikaId
  ? [
      [
        'script',
        {},
        `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${metrikaId}','ym');
ym(${metrikaId},'init',{ssr:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`,
      ],
      [
        'noscript',
        {},
        `<div><img src="https://mc.yandex.ru/watch/${metrikaId}" style="position:absolute; left:-9999px;" alt="" /></div>`,
      ],
    ]
  : [];

export default defineConfig({
  title: 'kilkenny packages',
  // адрес сайта на хостинге: SITE_BASE=/npm-packages/ для GitHub Pages проекта
  base: process.env.SITE_BASE ?? '/',
  cleanUrls: true,
  srcExclude: ['content/**', 'README.md'],
  head: metrika,
  locales,
  themeConfig: {
    search: { provider: 'local', options: { locales: searchLocales } },
  },
  vite: {
    plugins: [contentReload()],
    // Номер счётчика нужен и в браузере — theme/metrika.ts отправляет переходы между страницами
    define: { __METRIKA_ID__: JSON.stringify(metrikaId ?? '') },
  },
});
