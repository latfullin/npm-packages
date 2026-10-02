// useDraft — черновик формы: введённое сохраняется и восстанавливается после перезагрузки страницы
import { getCurrentScope, onScopeDispose, toRaw, watch } from 'vue';
import type { Form } from './form.js';
import { snapshot } from './utils.js';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface DraftOptions {
  // По умолчанию localStorage; sessionStorage — черновик живёт до закрытия вкладки
  storage?: StorageLike;
  // Задержка перед сохранением, мс
  debounce?: number;
}

export interface Draft {
  // Был ли черновик восстановлен при создании
  restored: boolean;
  clear(): void;
}

export function useDraft(form: Form<object, unknown>, key: string, options: DraftOptions = {}): Draft {
  const storage = options.storage ?? (globalThis as { localStorage?: StorageLike }).localStorage;
  const debounce = options.debounce ?? 300;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const draft: Draft = {
    restored: false,
    clear() {
      clearTimeout(timer);
      try {
        storage?.removeItem(key);
      } catch {}
    },
  };
  if (!storage) return draft;

  try {
    const saved = storage.getItem(key);
    if (saved) {
      form.setValues(JSON.parse(saved));
      draft.restored = true;
    }
  } catch {}

  // Пока есть несохранённые изменения — пишем черновик; форма сохранена или сброшена — удаляем
  watch(
    () => [snapshot(toRaw(form.values)), form.dirty] as const,
    ([, dirty]) => {
      clearTimeout(timer);
      if (!dirty) return draft.clear();
      timer = setTimeout(() => {
        try {
          storage.setItem(key, snapshot(form.values));
        } catch {}
      }, debounce);
    },
  );

  if (getCurrentScope()) onScopeDispose(() => clearTimeout(timer));
  return draft;
}
