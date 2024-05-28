# Build step
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json /app

# Install node dependencies and build
RUN npm install
COPY . .
RUN npm run build

# Run step
FROM node:18-slim AS server

WORKDIR /home/kokos

COPY package* ./

# Install node dependencies
RUN npm install
COPY --from=builder ./app/lib ./lib

# create kokos group
RUN addgroup kokos

RUN useradd -m -s /bin/bash -g kokos kokos

# set working dir permissions
RUN chown -R kokos:kokos /home/kokos

# run container as user kokos
USER kokos

EXPOSE 8011
CMD ["npm", "run", "start"]