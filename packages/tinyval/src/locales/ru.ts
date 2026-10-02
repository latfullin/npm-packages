import type { Message } from '../core.js';

const ru: Record<string, Message> = {
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
};

export default ru;
