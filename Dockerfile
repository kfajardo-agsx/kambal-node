FROM alpine:3.16.0 AS base

RUN echo http://dl-4.alpinelinux.org/alpine/v3.11/main > /etc/apk/repositories
RUN echo http://dl-4.alpinelinux.org/alpine/v3.11/community >> /etc/apk/repositories
RUN apk update && \
    apk add --no-cache \
      git \
      ca-certificates \
      tzdata && \
    update-ca-certificates && \
    adduser \    
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "10001" \
    "app"

FROM node:18.17.1 AS build

ARG NPM_TOKEN

WORKDIR /app

RUN echo //registry.npmjs.org/:_authToken=$NPM_TOKEN > ~/.npmrc
COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .
RUN npm run build

FROM node:18.17.1

COPY --from=base /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=base /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=base /etc/passwd /etc/passwd
COPY --from=base /etc/group /etc/group

COPY --from=build /app/build ./

USER app:app

ENTRYPOINT ["node", "index.js"]
