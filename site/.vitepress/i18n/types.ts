// Структура lang-файла: все тексты интерфейса сайта для одного языка
export interface LangFile {
  code: string; // код языка в URL и в языковых блоках страниц (::: ru)
  label: string; // название в переключателе языков
  lang: string; // атрибут lang у <html>
  description: string;
  nav: { packages: string };
  home: { tagline: string; action: string };
  theme: {
    outline: string;
    prev: string;
    next: string;
    returnToTop: string;
    menu: string;
    darkModeSwitch: string;
    lightModeTitle: string;
    darkModeTitle: string;
    langMenu: string;
    notFound: { title: string; quote: string; linkText: string };
  };
  search: { button: string; noResults: string; reset: string; select: string; navigate: string; close: string };
  // Заголовки, которые повторяются на страницах документации: ## @t(signature)
  docs: Record<'signature' | 'params' | 'codes' | 'examples' | 'example' | 'see' | 'notes', string>;
  demo: { version: string; local: string; unpublished: string; loading: string; failed: string };
}
