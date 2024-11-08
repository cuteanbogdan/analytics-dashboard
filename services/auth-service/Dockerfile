FROM node:18

WORKDIR /app

COPY lerna.json package.json yarn.lock ./
COPY libs ./libs
COPY services/auth-service ./services/auth-service

RUN yarn install --frozen-lockfile

WORKDIR /app/services/auth-service

RUN yarn workspace auth-service build

EXPOSE 5002

CMD ["yarn", "workspace", "auth-service", "start"]
