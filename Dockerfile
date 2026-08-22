FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++
RUN npm install -g pnpm@9.7.0
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/config ./config
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
