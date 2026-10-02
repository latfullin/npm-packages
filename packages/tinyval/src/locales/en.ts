import type { Message } from '../core.js';

const en: Record<string, Message> = {
  invalid: 'Invalid value',
  required: 'Required',
  string: 'Must be a string',
  number: 'Must be a number',
  boolean: 'Must be a boolean',
  date: 'Must be a valid date',
  object: 'Must be an object',
  array: 'Must be an array',
  literal: 'Must be {expected}',
  oneOf: 'Must be one of: {options}',
  unknownKey: 'Unknown field',
  minLength: 'Must be at least {min} long',
  maxLength: 'Must be at most {max} long',
  length: 'Must be exactly {length} long',
  min: 'Must be at least {min}',
  max: 'Must be at most {max}',
  integer: 'Must be an integer',
  pattern: 'Invalid format',
  email: 'Invalid email',
  sameAs: 'Must match {field}',
};

export default en;
