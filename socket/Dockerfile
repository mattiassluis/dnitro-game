# Full version to make sure all developers are running the same version
FROM node:12.13.0-alpine as node
# build stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["node", "index.js"]