# Build
FROM node:22-alpine AS build

WORKDIR /app
COPY *package.json ./

# Install dependencies
RUN npm install

COPY . .

# Compile TypeScript into Javascript
RUN npm run build


# Runtime
FROM node:22-slim AS runtime

WORKDIR /app

# Only copy the necessary files for runtime
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Réinstalle les dépendances prod uniquement
RUN npm install --omit=dev

CMD ["npm", "run", "start:prod"]
