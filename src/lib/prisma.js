import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const getSanitizedDatabaseUrl = () => {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;
  if (url.includes('#')) {
    url = url.replace(/#/g, '%23');
  }
  return url;
};

const sanitizedUrl = getSanitizedDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(
    sanitizedUrl
      ? {
          datasources: {
            db: {
              url: sanitizedUrl,
            },
          },
        }
      : undefined
  );

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
