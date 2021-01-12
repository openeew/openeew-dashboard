FROM node:14-alpine as build

WORKDIR /app
COPY . .

# Install dependencies
RUN npm run setup

#Build
RUN cd ./client && npm run build

ENV USE_STATIC true

EXPOSE 4000
CMD ["npm","run", "api"]