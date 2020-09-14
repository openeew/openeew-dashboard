FROM node:10 AS client-build
WORKDIR /usr/src/app
COPY client ./client/
RUN cd ./client && npm install && npm run build

FROM node:10 AS api-build
WORKDIR /root
COPY --from=client-build /usr/src/app/client/build ./client/build
COPY api ./api/
RUN cd api && npm install

EXPOSE 4000

CMD ["node", "./api/server.js"]