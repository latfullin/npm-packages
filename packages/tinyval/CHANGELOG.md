# Changelog

## 0.1.0

First release.

- Schemas: `string`, `number`, `boolean`, `date`, `literal`, `oneOf`, `enumOf`, `unknown`, `object`, `array`, `tuple`, `record`, `union`, `variant`, `lazy`, `optional`, `nullable`, `fallback`, `label`, `file`, `brand`, `transform`, `preprocess`, `coerce.*`
- Object helpers: `partial`, `pick`, `omit`, `extend`
- Laravel-style conditions: `requiredIf`, `requiredUnless`, `requiredWith`, `requiredWithout`, `prohibitedIf`
- Rules: length (strings and arrays), numbers, `between`, `pattern`, `email`, `url`, `uuid`, `startsWith`, `endsWith`, `includes`, `unique`, dates (`minDate`, `maxDate`, `after`, `before`), checksums (`inn`, `snils`, `luhn`), `sameAs`, `check`, `checkAsync`
- `validate`, `validateAsync`, `validateAny`, `parse`, `parseAsync`, `ValidationError`, `flatten`
- Options: `all`, `abortEarly`, per-call `messages` and `labels`, `maxDepth`
- Messages: locales `en`, `ru`, `zh`, plural forms, `{label}`, field-specific texts, `npx tinyval lang` to copy a locale into a project
- TypeScript types inferred from schemas, Standard Schema support
