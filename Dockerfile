FROM alpine:3.12 as build-client
RUN apk add --no-cache npm python3 make gcc g++
WORKDIR /build
COPY client/package*.json ./
RUN npm ci
COPY client .
RUN npm run build

FROM alpine:3.12 as build-server
RUN apk add --no-cache npm
WORKDIR /build
COPY server .
RUN npm i --prod

FROM alpine:3.12 as run
RUN apk add --no-cache nodejs
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000
CMD [ "node", "src/app.js" ]
COPY --from=build-server /build .
COPY --from=build-client /build/dist ./public
