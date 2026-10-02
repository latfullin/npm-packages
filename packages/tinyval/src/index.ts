// Правило: возвращает текст ошибки или null, если значение валидно
export type Rule = (value: unknown) => string | null;

export type Schema = Record<string, Rule[]>;

export interface Result {
  valid: boolean;
  errors: Record<string, string>;
}

export const required =
  (msg = 'Обязательное поле'): Rule =>
  (v) =>
    v === undefined || v === null || v === '' ? msg : null;

export const string =
  (msg = 'Должно быть строкой'): Rule =>
  (v) =>
    v == null || typeof v === 'string' ? null : msg;

export const number =
  (msg = 'Должно быть числом'): Rule =>
  (v) =>
    v == null || (typeof v === 'number' && !Number.isNaN(v)) ? null : msg;

export const minLength =
  (n: number, msg = `Минимум ${n} символов`): Rule =>
  (v) =>
    typeof v === 'string' && v.length < n ? msg : null;

export const maxLength =
  (n: number, msg = `Максимум ${n} символов`): Rule =>
  (v) =>
    typeof v === 'string' && v.length > n ? msg : null;

export const min =
  (n: number, msg = `Не меньше ${n}`): Rule =>
  (v) =>
    typeof v === 'number' && v < n ? msg : null;

export const max =
  (n: number, msg = `Не больше ${n}`): Rule =>
  (v) =>
    typeof v === 'number' && v > n ? msg : null;

export const pattern =
  (re: RegExp, msg = 'Неверный формат'): Rule =>
  (v) =>
    typeof v === 'string' && v !== '' && !re.test(v) ? msg : null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const email = (msg = 'Некорректный email'): Rule => pattern(EMAIL_RE, msg);

// Проверяет объект по схеме; для каждого поля возвращается первая ошибка
export function validate(data: Record<string, unknown>, schema: Schema): Result {
  const errors: Record<string, string> = {};
  let valid = true;

  for (const key in schema) {
    const rules = schema[key];
    const value = data[key];
    for (let i = 0; i < rules.length; i++) {
      const error = rules[i](value);
      if (error !== null) {
        errors[key] = error;
        valid = false;
        break;
      }
    }
  }

  return { valid, errors };
}
