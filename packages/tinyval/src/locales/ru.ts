import type { Messages } from '../core.js';

const ru = {
  invalid: 'Некорректное значение',
  required: 'Обязательное поле',
  string: 'Должно быть строкой',
  number: 'Должно быть числом',
  boolean: 'Должно быть логическим значением',
  date: 'Некорректная дата',
  object: 'Должно быть объектом',
  array: 'Должно быть списком',
  literal: 'Должно быть {expected}',
  oneOf: 'Допустимые значения: {options}',
  union: 'Значение не подходит ни под один из вариантов',
  variant: 'Неизвестный тип, допустимые: {options}',
  depth: 'Слишком глубокая вложенность (максимум {max})',
  unknownKey: 'Неизвестное поле',
  minLength: 'Минимальная длина — {min}',
  maxLength: 'Максимальная длина — {max}',
  length: 'Длина должна быть {length}',
  min: 'Не меньше {min}',
  max: 'Не больше {max}',
  integer: 'Должно быть целым числом',
  pattern: 'Неверный формат',
  email: 'Некорректный email',
  sameAs: 'Значения не совпадают',
} satisfies Messages;

export default ru;
