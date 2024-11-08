FROM node:18

WORKDIR /app

COPY lerna.json package.json yarn.lock ./
COPY libs ./libs
COPY services/analytics-api-service ./services/analytics-api-service

RUN yarn install --frozen-lockfile

WORKDIR /app/services/analytics-api-service

RUN mkdir -p dist/schema && cp -R src/schema/*.graphql dist/schema/

RUN yarn workspace analytics-api-service build

EXPOSE 5003

CMD ["yarn", "workspace", "analytics-api-service", "start"]
