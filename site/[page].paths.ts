// Все страницы сайта создаются из одного шаблона [page].md — см. .vitepress/docs/content.ts
import { allPages } from './.vitepress/docs/content';

export default {
  paths: allPages,
};
