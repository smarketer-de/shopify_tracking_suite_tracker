FROM node:14-alpine as base

WORKDIR /src
COPY package*.json ./
EXPOSE 8084

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . .
RUN npm run build
# TODO: Replace with ngnix
CMD ["npm", "run", "dev:server"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install
CMD ["npm", "run", "dev"]
