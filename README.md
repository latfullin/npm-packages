# npm-packages

Монорепозиторий с моими npm-пакетами и сайтом-документацией к ним.

- Пакеты лежат в `packages/`, каждый публикуется на npm отдельно и со своей версией.
- Сайт (`site/`) собран на [VitePress](https://vitepress.dev). На нём у каждого пакета есть документация и живое демо с переключателем версий.

## Структура

```
npm-packages/
├── package.json          # npm workspaces + общие команды
├── tsconfig.json         # список пакетов для общей сборки (tsc -b)
├── packages/
│   └── tinyval/          # пакет
│       ├── src/          # исходники
│       ├── test/         # тесты (node:test)
│       ├── dist/         # сборка, генерируется
│       ├── package.json
│       └── README.md     # публикуется на npm вместе с пакетом
└── site/
    ├── .vitepress/
    │   ├── config.ts                       # меню, боковая панель
    │   └── theme/components/PackageDemo.vue  # демо с выбором версии
    ├── index.md          # главная
    └── tinyval/index.md  # страница пакета
```

## Команды

Все команды запускаются из корня репозитория.

| Команда | Что делает |
| --- | --- |
| `npm install` | Ставит зависимости и связывает пакеты с сайтом |
| `npm run dev` | Сайт на http://localhost:5173 + пересборка пакетов при изменениях |
| `npm test` | Тесты всех пакетов |
| `npm run build` | Сборка всех пакетов и статического сайта (`site/.vitepress/dist`) |

## Локальная разработка

```bash
npm install
npm run dev
```

Пакеты подключаются к сайту через npm workspaces: в `node_modules/tinyval` лежит симлинк на `packages/tinyval`. Изменения в `packages/*/src` сразу видны в демо на сайте, публиковать ничего не нужно.

В демо пункт **«локальная»** означает текущий код из `packages/`, а номера версий — опубликованные релизы с npm (их код загружается через jsDelivr).

### Проверить пакет в другом проекте

```bash
cd packages/tinyval && npm link
cd ~/www/другой-проект && npm link tinyval
```

Перед публикацией полезно проверить, что именно уйдёт на npm:

```bash
npm pack --dry-run -w tinyval
```

## Публикация на npm

Один раз:

```bash
npm login
```

Выпуск новой версии:

```bash
npm version patch -w tinyval   # 0.1.0 → 0.1.1
npm publish -w tinyval
```

- `-w tinyval` — выполнить команду в конкретном пакете.
- Перед публикацией автоматически запускаются сборка и тесты (`prepublishOnly`). Если тесты упали — публикации не будет.
- На npm уходит только то, что указано в поле `"files"` пакета (у `tinyval` — `dist`).
- После публикации новая версия сама появится в переключателе на сайте; jsDelivr иногда подхватывает её с задержкой в несколько минут.

### Какую версию поднимать

| Команда | Пример | Когда |
| --- | --- | --- |
| `npm version patch` | 0.1.0 → 0.1.1 | Исправление ошибки, API не изменился |
| `npm version minor` | 0.1.0 → 0.2.0 | Новые возможности, старый код пользователей работает |
| `npm version major` | 0.1.0 → 1.0.0 | Изменения, ломающие совместимость |

### Git

В монорепозитории `npm version` не создаёт коммит и тег, поэтому делаем это вручную:

```bash
git commit -am "tinyval@0.1.1"
git tag tinyval@0.1.1
git push --follow-tags
```

## Добавить новый пакет

1. Скопировать `packages/tinyval` в `packages/<имя>`, удалить `dist` и `.tsbuildinfo`.
2. В `packages/<имя>/package.json` поменять `name`, `version` (`0.1.0`), `description`, `keywords`.
3. Добавить пакет в `references` корневого `tsconfig.json`:
   ```json
   { "path": "packages/<имя>" }
   ```
4. Подключить к сайту:
   - в `site/package.json` добавить в `dependencies`: `"<имя>": "*"`;
   - в `site/.vitepress/config.ts` добавить пункт в `nav` и `sidebar`;
   - создать страницу `site/<имя>/index.md` с демо:
     ```md
     <script setup>
     import pkg from '<имя>/package.json';
     const loadLocal = () => import('<имя>');
     </script>

     <PackageDemo name="<имя>" :local-version="pkg.version" :load-local="loadLocal" v-slot="{ lib }">
       …демо, использующее lib…
     </PackageDemo>
     ```
5. Выполнить `npm install` в корне.

## Важно

- **`.gitignore` и `"files"` — разные вещи.** `.gitignore` решает, что попадёт в git; `"files"` в package.json пакета — что попадёт на npm.
- Генерируемые файлы (`node_modules`, `dist`, `.tsbuildinfo`) игнорируются корневым `.gitignore` во всех папках — для новых пакетов ничего добавлять не нужно.
- Демо на сайте написано под текущий API. Если API изменится, старые версии в переключателе могут сломать демо — тогда в демо нужно учитывать `version` (его тоже передаёт `PackageDemo`).
- Пакеты не должны иметь runtime-зависимостей (`dependencies`) — только `devDependencies`.
