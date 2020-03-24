FROM node:lts-alpine as build
WORKDIR /build
COPY client/package*.json ./
RUN npm ci
COPY client .
RUN npm run build

FROM iron/node as run
WORKDIR /app
COPY server .
COPY --from=build /build/dist ./public
RUN npm i --prod
EXPOSE 3000
CMD [ "npm", "start" ]
