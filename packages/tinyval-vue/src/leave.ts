// useLeaveGuard — предупреждение при закрытии страницы и переходах внутри приложения, если есть несохранённые изменения
import { getCurrentScope, onScopeDispose } from 'vue';
import type { Form } from './form.js';

type Win = Pick<Window, 'addEventListener' | 'removeEventListener'>;

export interface LeaveGuardOptions {
  // Передайте onBeforeRouteLeave из vue-router — предупреждение сработает и при переходах внутри приложения
  onBeforeRouteLeave?: (guard: () => boolean | Promise<boolean>) => void;
  // Своё окно подтверждения для переходов внутри приложения (по умолчанию window.confirm)
  confirm?: (message: string) => boolean | Promise<boolean>;
  message?: string;
}

export function useLeaveGuard(form: Form<any, any>, options: LeaveGuardOptions = {}): () => void {
  const { message = 'You have unsaved changes. Leave anyway?' } = options;
  const hasChanges = () => form.dirty && !form.submitting;
  const confirmLeave =
    options.confirm ?? ((m: string) => (globalThis as { confirm?: (m: string) => boolean }).confirm?.(m) ?? true);

  // переход внутри приложения: true — уйти, false — остаться
  options.onBeforeRouteLeave?.(() => !hasChanges() || confirmLeave(message));

  const win = (globalThis as { window?: Win }).window;
  if (!win) return () => {};
  const onBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasChanges()) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  win.addEventListener('beforeunload', onBeforeUnload);
  const stop = () => win.removeEventListener('beforeunload', onBeforeUnload);
  if (getCurrentScope()) onScopeDispose(stop);
  return stop;
}
