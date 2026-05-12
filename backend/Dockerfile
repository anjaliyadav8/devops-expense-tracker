FROM node:18-alpine
LABEL maintainer="Anjali DevOps Project"
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "server.js"]
