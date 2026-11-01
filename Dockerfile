# syntax=docker/dockerfile:1

# Собираем сайт документации и отдаём его статикой через Caddy.
# Пакеты собираются здесь же: сайт импортирует их из packages/*/dist через workspaces.

FROM node:24-alpine AS build
WORKDIR /app

# Сначала только манифесты: слой с npm ci переиспользуется, пока зависимости не менялись.
# --parents сохраняет пути, так что новые пакеты в packages/ подхватятся сами.
COPY --parents package.json package-lock.json tsconfig.json packages/*/package.json site/package.json ./
RUN npm ci

COPY packages packages
COPY site site

# Номер счётчика Яндекс.Метрики. Сайт статический, поэтому счётчик вшивается при сборке:
# без METRIKA_ID его в страницах не будет (так и нужно для локальной сборки).
ARG METRIKA_ID=
ENV METRIKA_ID=$METRIKA_ID
RUN npm run build


FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/site/.vitepress/dist /srv

EXPOSE 80 443
