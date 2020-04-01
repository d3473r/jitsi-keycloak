FROM node:lts-alpine as build
WORKDIR /build
COPY client/package*.json ./
RUN apk add python3 make gcc g++ --no-cache
RUN npm ci
COPY client .
RUN npm run build

FROM alpine:3.8 as run
RUN apk add --no-cache npm
WORKDIR /app
COPY server .
COPY --from=build /build/dist ./public
RUN npm i --prod
EXPOSE 3000
CMD [ "npm", "start" ]
