// Переходы по сайту для Яндекс.Метрики. VitePress — SPA: при клике по ссылке страница
// не перезагружается, счётчик из head срабатывает только на первой. Остальные отправляем сами.
// __METRIKA_ID__ подставляет vite.define в config.ts из METRIKA_ID; пусто — счётчика нет.
import type { Router } from 'vitepress';

declare const __METRIKA_ID__: string;

type Ym = (id: number, action: string, url?: string, options?: Record<string, unknown>) => void;

export function trackRouteChanges(router: Router): void {
  const id = Number(__METRIKA_ID__);
  if (!id || typeof window === 'undefined') return;

  let from = window.location.href;

  router.onAfterRouteChange = () => {
    const ym = (window as unknown as { ym?: Ym }).ym;
    // Первую страницу уже учёл счётчик из head — иначе просмотр посчитается дважды
    if (!ym || window.location.href === from) return;
    ym(id, 'hit', window.location.href, { referer: from });
    from = window.location.href;
  };
}
