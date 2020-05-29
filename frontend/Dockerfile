# Full version to make sure all developers are running the same version
FROM node:12.13.0-alpine as node
# build stage
WORKDIR /app
COPY package*.json ./
COPY .env* ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:1.13.12-alpine
RUN addgroup -g 500 -S dnitro && adduser -u 500 -S dnitro -G dnitro
COPY --chown=dnitro:dnitro ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=dnitro:dnitro --from=node /app/dist /usr/share/nginx/html

RUN touch /var/run/nginx.pid \
  && chown -R dnitro:dnitro /var/run/nginx.pid \
  && chown -R dnitro:dnitro /var/cache/nginx \
  && chown -R dnitro:dnitro /etc/nginx/nginx.conf

USER 500
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]