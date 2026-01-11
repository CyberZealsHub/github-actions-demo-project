FROM ubuntu:latest
LABEL authors="geetesh"

ENTRYPOINT ["top", "-b"]

# Step 1: Build the app
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Run the app
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --only=production

EXPOSE 3000
CMD ["node", "dist/index.js"]