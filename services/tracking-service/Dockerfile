FROM node:18

WORKDIR /app

COPY lerna.json package.json yarn.lock ./
COPY libs ./libs
COPY services/tracking-service ./services/tracking-service

RUN yarn install --frozen-lockfile

WORKDIR /app/services/tracking-service

RUN yarn workspace tracking-service build

EXPOSE 5001

CMD ["yarn", "workspace", "tracking-service", "start"]
