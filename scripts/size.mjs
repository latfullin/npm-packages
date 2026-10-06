// Размер типичных сценариев использования пакетов (минификация + gzip). Падает, если превышен лимит —
// так цифры «~2.5 kB» в документации остаются правдой. Запуск: npm run size (после сборки пакетов)
import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pkg = (p) => `${root}packages/${p}`;

// limit — в килобайтах gzip, с небольшим запасом над текущим размером
const cases = [
  ['tinyval: типичная форма', "import { validate, object, string, number, optional, pipe, minLength, email } from 'tinyval'; console.log(validate, object, string, number, optional, pipe, minLength, email);", 2.8],
  ['tinyval: + условия, ИНН, file', "import { validate, object, string, pipe, minLength, email, requiredIf, inn, file } from 'tinyval'; console.log(validate, object, string, pipe, minLength, email, requiredIf, inn, file);", 3.4],
  ['tinyval: весь пакет', "export * from 'tinyval';", 6],
  ['tinyval-mask: свой шаблон', "import { mask, unmask } from 'tinyval-mask'; console.log(mask, unmask);", 1.1],
  ['tinyval-mask: телефон + attach', "import { attach } from 'tinyval-mask'; import { phone } from 'tinyval-mask/presets'; console.log(attach, phone);", 2.7],
  ['tinyval-mask: phoneAuto + v-mask', "import { phoneAuto, countryName } from 'tinyval-mask/presets'; import { vMask } from 'tinyval-mask/vue'; console.log(phoneAuto, countryName, vMask);", 3.3],
  ['tinyval-mask: весь пакет', "export * from 'tinyval-mask'; export * from 'tinyval-mask/presets'; export * from 'tinyval-mask/vue';", 5.4],
  ['tinyval-phone: phoneAuto все страны', "import { phoneAuto } from 'tinyval-phone'; console.log(phoneAuto);", 4.3],
  ['tinyval-phone: loadFlag (без флагов)', "import { loadFlag } from 'tinyval-phone/flags'; console.log(loadFlag);", 3.5],
  ['tinyval-vue: useForm', "import { useForm } from 'tinyval-vue'; console.log(useForm);", 2.3],
  ['tinyval-vue: весь пакет', "export * from 'tinyval-vue';", 4.6],
];

let failed = false;
for (const [name, code, limit] of cases) {
  const result = await build({
    stdin: { contents: code, resolveDir: root, loader: 'js' },
    bundle: true,
    minify: true,
    format: 'esm',
    write: false,
    // флаги грузятся отдельными чанками по требованию — в размер входит только сам загрузчик
    splitting: true,
    outdir: 'out',
    // фреймворк и пакеты-зависимости не считаются: они уже есть в проекте пользователя
    external: ['vue', ...(name.startsWith('tinyval-vue') ? ['tinyval'] : [])],
    alias: {
      'tinyval-mask/presets': `${pkg('tinyval-mask')}/dist/presets.js`,
      'tinyval-mask/vue': `${pkg('tinyval-mask')}/dist/vue.js`,
      'tinyval-mask': `${pkg('tinyval-mask')}/dist/index.js`,
      'tinyval-vue': `${pkg('tinyval-vue')}/dist/index.js`,
      'tinyval-phone/flags': `${pkg('tinyval-phone')}/dist/flag-icons.js`,
      'tinyval-phone': `${pkg('tinyval-phone')}/dist/index.js`,
      ...(name.startsWith('tinyval-vue') ? {} : { tinyval: `${pkg('tinyval')}/dist/index.js` }),
    },
    logLevel: 'error',
  });
  const entry = result.outputFiles.find((f) => f.path.endsWith('stdin.js')) ?? result.outputFiles[0];
  const kb = gzipSync(entry.contents, { level: 9 }).length / 1024;
  const ok = kb <= limit;
  if (!ok) failed = true;
  console.log(`${ok ? '✓' : '✗'} ${name.padEnd(36)} ${kb.toFixed(2).padStart(5)} kB / ${limit} kB`);
}
if (failed) {
  console.error('\nРазмер превысил лимит. Если рост оправдан — поднимите лимит в scripts/size.mjs и цифры в документации.');
  process.exit(1);
}
