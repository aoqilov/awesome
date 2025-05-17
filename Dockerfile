# ---------- BASE STAGE ----------
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat curl

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm install --legacy-peer-deps; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm install --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

COPY .env.prod .env

COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# ---------- RUNNER STAGE ----------
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy as a server config instead of replacing nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]