# --- Build Stage ---
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
RUN npx prisma generate
RUN npm run build

# --- Runner Stage ---
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NODE_ENV=production
ENV NEXTAUTH_SECRET="auraai_super_secret_jwt_key_2026_production_fallback"
ENV NEXTAUTH_URL="https://ai.neqtra.com"
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000

# Push schema changes on startup, then launch Next.js
CMD ["sh", "-c", "node scripts/validate-db-url.js && npx prisma db push && npm run start"]
