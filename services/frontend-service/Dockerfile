FROM node:18

WORKDIR /app

ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ARG NEXT_PUBLIC_ANALYTICS_SERVICE_URL

ENV NEXT_PUBLIC_AUTH_SERVICE_URL=$NEXT_PUBLIC_AUTH_SERVICE_URL
ENV NEXT_PUBLIC_ANALYTICS_SERVICE_URL=$NEXT_PUBLIC_ANALYTICS_SERVICE_URL

COPY lerna.json package.json yarn.lock ./

COPY libs ./libs
COPY services/frontend-service ./services/frontend-service

RUN yarn install --frozen-lockfile

WORKDIR /app/services/frontend-service

RUN yarn workspace frontend-service build

EXPOSE 3000

CMD ["yarn", "workspace", "frontend-service", "start"]
