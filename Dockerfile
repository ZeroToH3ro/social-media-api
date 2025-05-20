FROM node:20-alpine AS build

WORKDIR /app

RUN npm install -g pnpm@8

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN chmod -R u+rwX .

RUN pnpm run build

FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g pnpm@8

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --no-frozen-lockfile

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]