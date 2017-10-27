FROM node:8.1.4-alpine

RUN apk add --update curl git && \
    rm -rf /var/cache/apk/*

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm install --global --silent yarn && \
	yarn install --silent

CMD yarn run serve
