import type { Messages } from '../core.js';

const zh = {
  invalid: '无效的值',
  required: '此项为必填项',
  string: '必须是字符串',
  number: '必须是数字',
  boolean: '必须是布尔值',
  date: '必须是有效的日期',
  object: '必须是对象',
  array: '必须是数组',
  literal: '必须是 {expected}',
  oneOf: '必须是以下值之一：{options}',
  union: '不符合任何允许的类型',
  variant: '未知类型，允许的值：{options}',
  depth: '嵌套层级过深（最多 {max}）',
  unknownKey: '未知字段',
  minLength: '长度不能少于 {min}',
  maxLength: '长度不能超过 {max}',
  length: '长度必须为 {length}',
  min: '不能小于 {min}',
  max: '不能大于 {max}',
  integer: '必须是整数',
  pattern: '格式无效',
  email: '邮箱地址无效',
  sameAs: '必须与 {field} 一致',
} satisfies Messages;

export default zh;
