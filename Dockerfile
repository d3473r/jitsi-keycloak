FROM node:lts-alpine as build-client
WORKDIR /build
COPY client/package*.json ./
RUN apk add python3 make gcc g++ --no-cache
RUN npm ci
COPY client .
RUN npm run build

FROM alpine:3.8 as build-server
RUN apk add --no-cache npm
WORKDIR /build
COPY server .
RUN npm i --prod

FROM alpine:3.8 as run
RUN apk add --no-cache nodejs
WORKDIR /app
COPY --from=build-server /build .
COPY --from=build-client /build/dist ./public
ENV NODE_ENV=production
EXPOSE 3000
CMD [ "node", "src/app.js" ]
