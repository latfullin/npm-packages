# holidays-api

API праздников и рабочих дней: ~200 стран из [date-holidays](https://github.com/commenthol/date-holidays), для РФ — производственный календарь по постановлениям Правительства (переносы, рабочие субботы, предпраздничные дни, нормы часов).

```sh
npm run build -w apps/holidays-api
npm start -w apps/holidays-api        # http://localhost:3000/v1
npm test -w apps/holidays-api
```

## Методы

Везде `:country` — ISO-код (`ru`, `de`), необязательно `?region=` (`de?region=by`) и `?lang=` (язык названий).

| Метод | Ответ |
| --- | --- |
| `GET /v1/countries` | страны `[{ code, name }]` |
| `GET /v1/countries/:country/regions` | регионы страны |
| `GET /v1/holidays/:country/:year?types=public,observance` | праздники по дням; типы: `public` (по умолчанию), `bank`, `optional`, `school`, `observance` |
| `GET /v1/calendar/:country/:year` | производственный календарь: по месяцам рабочие/нерабочие дни, сокращённые, часы при 40/36/24-часовой неделе; переносы и рабочие выходные |
| `GET /v1/day/:country/:date` | `{ workday, kind, short?, holiday? }`, `kind`: `workday`, `weekend`, `holiday`, `transfer`, `working-weekend` |
| `GET /v1/workdays/:country/count?from=&to=` | рабочих дней в периоде (включительно, до 3660 дней) |
| `GET /v1/workdays/:country/add?date=&days=` | дата через `days` рабочих дней, отрицательное — назад |

РФ: годы с постановлением о переносах — в [src/ru.ts](src/ru.ts), сверены с КонсультантПлюс. Для остальных лет переносы считаются по ст. 112 ТК РФ, в ответе `estimated: true`. Новый год добавляется записью в `ruYears` после выхода постановления (обычно в сентябре — октябре).

Выходные страны — день отдыха из date-holidays и день перед ним (воскресенье → сб + вс, суббота → пт + сб).

## Лимиты

Сутки по UTC, счётчики в памяти процесса (при нескольких экземплярах — у каждого свои).

- без ключа — `LIMIT_ANONYMOUS` запросов по IP (100);
- с ключом — `LIMIT_KEYED` (10 000): `Authorization: Bearer <key>` или `X-API-Key: <key>`, ключи — `API_KEYS` через запятую.

Заголовки `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`; сверх лимита — `429` и `Retry-After`, неизвестный ключ — `401`. За прокси — `TRUST_PROXY=1`, тогда IP берётся из `X-Forwarded-For`.

## Бэклог

- **Клиентский пакет** (npm): типизированные методы на все ручки, ключ в конструкторе, разбор `429`/`Retry-After` и заголовков лимита, кеш ответов (календарь года не меняется), работа в браузере и Node.
- Выдача ключей: регистрация, хранение ключей и счётчиков в БД/Redis вместо памяти и `API_KEYS`.
- Производственные календари с переносами для BY, KZ, UZ.
- Деплой: Dockerfile, CDN-кеш для `/v1/calendar` и `/v1/holidays`.

Данные — см. [NOTICE](NOTICE): праздники date-holidays под CC BY-SA 3.0, ссылка на источник обязательна (отдаётся в `GET /v1`).
