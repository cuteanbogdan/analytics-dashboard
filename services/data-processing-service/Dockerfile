FROM node:18

WORKDIR /app

COPY lerna.json package.json yarn.lock ./
COPY libs ./libs
COPY services/data-processing-service ./services/data-processing-service

RUN yarn install --frozen-lockfile

WORKDIR /app/services/data-processing-service

RUN yarn workspace data-processing-service build

CMD ["yarn", "workspace", "data-processing-service", "start"]
