// Текст на нескольких языках. Строка — одинаково во всех языках. Английский обязателен: он используется, если перевода нет
export type Tr = string | ({ en: string } & Record<string, string>);

// Страница раздела: имя функции (slug и заголовок выводятся из него) или slug + заголовок
export type PageRef = string | { slug: string; title: Tr };

export interface Section {
  dir: string;
  title: Tr;
  pages: PageRef[];
}

export interface PackageMeta {
  name: string;
  description: Tr;
  intro: Tr; // заголовок вводной страницы в меню
  sections: Section[];
}
