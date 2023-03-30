FROM node:18-alpine

LABEL maintainer="vijaywargishivam@gmail.com"

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 5000

CMD ["yarn", "build:start"]