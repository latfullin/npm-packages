# npm-packages

Монорепозиторий с моими npm-пакетами и сайтом-документацией к ним.

- Пакеты лежат в `packages/`, каждый публикуется на npm отдельно и со своей версией.
- Сайт (`site/`) собран на [VitePress](https://vitepress.dev). На нём у каждого пакета есть документация и живое демо с переключателем версий.

## Структура

```
npm-packages/
├── package.json          # npm workspaces + общие команды
├── tsconfig.json         # список пакетов для общей сборки (tsc -b)
├── Dockerfile            # сборка сайта и образ с Caddy
├── Caddyfile             # кэш, 404 и заголовки (домены и HTTPS — в репозитории proxy)
├── docker-compose.yml    # запуск контейнера в общей сети web, за глобальным прокси
├── packages/
│   ├── tinyval-mask/     # маски ввода, без зависимостей
│   ├── tinyval-phone/    # телефоны всех стран и флаги (данные генерирует scripts/generate.mjs)
│   ├── tinyval-vue/      # формы во Vue на tinyval (зависит от tinyval)
│   └── tinyval/          # пакет
│       ├── src/          # исходники
│       ├── test/         # тесты (node:test)
│       ├── dist/         # сборка, генерируется
│       ├── package.json
│       └── README.md     # публикуется на npm вместе с пакетом
└── site/
    ├── [page].md                             # единственный шаблон: из него создаются все страницы
    ├── [page].paths.ts                       # список страниц сайта на всех языках
    ├── content/                              # тексты страниц — по одному файлу на страницу
    │   ├── index.ts                          # список пакетов на сайте
    │   ├── types.ts
    │   └── tinyval/
    │       ├── meta.ts                       # разделы меню и заголовки страниц
    │       ├── index.md                      # вводная страница
    │       └── guide/, api/, schemas/, actions/
    └── .vitepress/
        ├── config.ts                         # языки, меню и поиск собираются из lang-файлов и meta.ts
        ├── docs/content.ts                   # сборка страниц из content/ для каждого языка
        ├── i18n/                             # lang-файлы: тексты интерфейса сайта
        │   ├── index.ts                      # список языков
        │   ├── ru.ts, en.ts, zh.ts
        │   └── types.ts                      # какие тексты должны быть в lang-файле
        └── theme/components/
            ├── PackageDemo.vue               # демо с выбором версии (общее для всех пакетов)
            └── TinyvalDemo.vue               # демо tinyval
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

### Автоматически, из GitHub Actions

Публикует `.github/workflows/publish.yml`: `scripts/publish.mjs` сравнивает версию каждого
пакета с реестром и отправляет только те, которых там ещё нет. Поднимать версию в
`package.json` всё равно нужно вручную — это и есть решение «выпускаем».

```bash
npm version patch -w tinyval --no-git-tag-version   # 0.1.0 → 0.1.1
git commit -am "tinyval@0.1.1"
git tag v0.1.1 && git push --follow-tags            # тег v* запускает публикацию
```

- Повторный запуск безопасен: уже опубликованные версии пропускаются, перезалить версию npm и так не даёт.
- Порядок зависимостей соблюдается (`order` в `scripts/publish.mjs`): сначала `tinyval` и `tinyval-mask`, потом зависящие от них.
- Версия с дефисом (`0.2.0-beta.1`) уходит под тегом `next`, то есть `npm install` её не поставит.
- Сначала проверить без публикации: вкладка **Actions → Publish → Run workflow**, галка dry run включена по умолчанию.
- Нужен секрет `NPM_TOKEN` (npmjs.com → Access Tokens → Granular, Read and write, с обходом 2FA).

### Вручную

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

### Пакеты, которые зависят друг от друга

`tinyval-vue` указывает `tinyval` в `peerDependencies`. Если в tinyval вышли изменения, которые нужны tinyval-vue, публикуйте сначала `tinyval`, потом `tinyval-vue`, и поднимите в нём версию в `peerDependencies`. Так же `tinyval-phone` зависит от `tinyval-mask`: сначала `tinyval-mask`, потом `tinyval-phone`.

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

## Деплой сайта

Сайт собирается в статику и отдаётся через [Caddy](https://caddyserver.com) по http
внутри docker-сети. Наружу его выставляет **глобальный прокси** — отдельный репозиторий
`proxy`, один на машину: он держит порты 80 и 443, разбирает домены и выпускает
сертификаты Let's Encrypt. Поэтому локально и на сервере всё поднимается одинаково.

Файлы: `Dockerfile` (сборка пакетов и сайта → образ с Caddy), `Caddyfile` (кэш, 404,
заголовки), `docker-compose.yml`, `.env.example`. Домен прописан не здесь, а в
`proxy/nginx/conf.d/tinyval.ru.conf`.

### Первый запуск

Прокси должен быть запущен — он создаёт сеть `web`, без неё контейнер не поднимется:

```bash
cd ../proxy && ./up.sh

git clone git@github.com:latfullin/npm-packages.git
cd npm-packages
docker compose up -d --build
```

Локально сайт открывается на http://tinyval.ru/ (нужна строка в `hosts`, см. README
прокси). На сервере, когда A-запись домена указывает на его IP, остаётся выпустить
сертификат — один раз, дальше продлевается само:

```bash
cd ../proxy && ./cert.sh tinyval.ru www.tinyval.ru
```

### Автодеплой по пушу в main

`.github/workflows/deploy.yml`: GitHub подключается к серверу по SSH, делает
`git reset --hard` на пришедший коммит, `docker compose up -d --build` и проверяет,
что сайт отвечает 200. Запускается только если менялось то, что попадает в образ
(`packages/`, `site/`, `Dockerfile`, `Caddyfile`, манифесты), либо вручную из Actions.

Секреты (Settings → Secrets and variables → Actions):

| Секрет | Зачем |
| --- | --- |
| `DEPLOY_HOST` | адрес сервера |
| `DEPLOY_USER` | пользователь для SSH |
| `DEPLOY_SSH_KEY` | приватный ключ целиком, со строками BEGIN/END |
| `DEPLOY_PATH` | путь к клону на сервере, например `/srv/npm-packages` |
| `DEPLOY_PORT` | порт SSH, если не 22 (необязательно) |

Переменная `DEPLOY_URL` (вкладка Variables) — что проверять после деплоя, по умолчанию
`https://tinyval.ru/`.

На сервере заранее: клон репозитория в `DEPLOY_PATH`, публичный ключ в
`~/.ssh/authorized_keys`, пользователь в группе `docker`, запущенный прокси
(`../proxy/up.sh` создаёт сеть `web`). Сервер должен быть доступен снаружи по SSH —
GitHub приходит сам. Для машины за NAT (в том числе WSL) это не работает: там нужен
self-hosted runner или `git pull` по таймеру.

### Обновить сайт вручную

```bash
git pull
docker compose up -d --build
```

Старый контейнер заменится новым. Сертификаты лежат в томе прокси и пересборки не касаются.

### Полезное

```bash
docker compose logs -f         # логи Caddy
docker compose ps              # состояние, healthcheck ходит на /healthz
docker compose down            # остановить
curl -H 'Host: tinyval.ru' http://localhost/        # проверить через прокси, без правки hosts
docker run --rm -p 8080:80 -e SITE_ADDRESS=:80 tinyval-docs   # проверить образ сам по себе
```

### Если что-то не так

- **502 от прокси** — контейнер `tinyval-docs` не поднят или переименован: сверьте
  `docker ps` с `set $upstream` в `proxy/nginx/conf.d/tinyval.ru.conf`.
- **Сертификат не выпускается** — домен должен резолвиться в IP сервера, а порт 80
  снаружи быть открыт: через него идёт проверка Let's Encrypt. Логи: `cd ../proxy && docker compose logs certbot`.
- **Caddy полез за своим сертификатом** — в `.env` в `SITE_ADDRESS` попал домен вместо
  `:80`. За https отвечает прокси, Caddy должен слушать только http.
- **После деплоя видна старая страница** — HTML отдаётся с `must-revalidate`, но CDN перед сервером может кэшировать; сбросьте кэш там.

## Добавить новый пакет

1. Скопировать `packages/tinyval` в `packages/<имя>`, удалить `dist` и `.tsbuildinfo`.
2. В `packages/<имя>/package.json` поменять `name`, `version` (`0.1.0`), `description`, `keywords`, `homepage` (`https://tinyval.ru/<имя>/`) и `directory` в `repository`.
3. Добавить пакет в `references` корневого `tsconfig.json`:
   ```json
   { "path": "packages/<имя>" }
   ```
4. Подключить к сайту:
   - в `site/package.json` добавить в `dependencies`: `"<имя>": "*"`;
   - создать `site/content/<имя>/meta.ts` (разделы и страницы, по образцу `tinyval/meta.ts`) и страницы `.md`;
   - добавить пакет в `site/content/index.ts` — он появится в меню, на главной и во всех языках;
   - для демо — компонент в `site/.vitepress/theme/components/` на основе `PackageDemo` (пример — `TinyvalDemo.vue`), зарегистрировать в `theme/index.ts` и вставить в `index.md` пакета.
5. Выполнить `npm install` в корне.

## Языки сайта

Сайт один: все страницы создаются из одного шаблона `site/[page].md`. Языки — русский (по умолчанию, без префикса в URL), английский (`/en/`) и китайский (`/zh/`).

- **Интерфейс** (меню, кнопки, поиск, заголовки «Сигнатура», «Примеры»…) — lang-файлы `site/.vitepress/i18n/<код>.ts`.
- **Тексты страниц** — один файл на страницу в `site/content/`. Общие части (код, сигнатуры) пишутся один раз, тексты — в языковых блоках:

  ````md
  ::: ru
  Проверяет данные и возвращает их…
  :::

  ::: en
  Validates data and returns it…
  :::

  ## @t(signature)

  ```ts
  function parse(schema, value): Infer<S>
  ```
  ````

  - `@t(signature)` — текст из раздела `docs` lang-файла.
  - Ссылки внутри пакета пишутся как `[validate](~/api/validate)` — префикс языка подставится сам.
  - Если блока для языка нет, показывается английский текст.
- **Заголовки страниц и разделов меню** — `site/content/<пакет>/meta.ts`.
- **Сообщения об ошибках в пакете** — локали `packages/tinyval/src/locales/<код>.ts`.

В dev-режиме правки в `content/` подхватываются сразу, без перезапуска.

### Добавить язык

1. Скопировать `site/.vitepress/i18n/en.ts` в `site/.vitepress/i18n/<код>.ts` и перевести. TypeScript подскажет, если какой-то текст пропущен.
2. Добавить язык в список `langs` в `site/.vitepress/i18n/index.ts`.

После этого весь сайт уже доступен на новом языке: интерфейс переведён, а тексты страниц — английские. Дальше постепенно добавляйте блоки `::: <код>` в страницы `site/content/` и переводы заголовков в `meta.ts`.

По желанию — локаль сообщений пакета: `packages/tinyval/src/locales/<код>.ts`, строка в `exports` в `package.json` и в `TinyvalDemo.vue`.

## Важно

- **`.gitignore` и `"files"` — разные вещи.** `.gitignore` решает, что попадёт в git; `"files"` в package.json пакета — что попадёт на npm.
- Генерируемые файлы (`node_modules`, `dist`, `.tsbuildinfo`) игнорируются корневым `.gitignore` во всех папках — для новых пакетов ничего добавлять не нужно.
- Демо на сайте написано под текущий API. Если API изменится, старые версии в переключателе могут сломать демо — тогда в демо нужно учитывать `version` (его тоже передаёт `PackageDemo`).
- Пакеты не должны иметь runtime-зависимостей (`dependencies`) — только `devDependencies`.
