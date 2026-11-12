import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { fallbackDb } from "@/lib/db-fallback";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function hasUsableDatabaseUrl(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;
  if (process.env.VERCEL && (url.includes("localhost") || url.includes("127.0.0.1"))) {
    return false;
  }
  return true;
}

function createPrisma(): PrismaClient | null {
  if (!hasUsableDatabaseUrl()) return null;
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

const realClient = globalForPrisma.prisma ?? createPrisma();
if (realClient && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = realClient;
}

function createResilientDb(): PrismaClient {
  if (!realClient) return fallbackDb;
  return new Proxy(realClient, {
    get(target, prop, receiver) {
      if (prop === "$transaction") {
        return async (arg: any) => {
          try {
            return await (target as any).$transaction(arg);
          } catch {
            return (fallbackDb as any).$transaction(arg);
          }
        };
      }
      const origModel = Reflect.get(target, prop, receiver);
      const fbModel = (fallbackDb as any)[prop];
      if (!origModel || typeof origModel !== "object" || !fbModel) {
        return origModel;
      }
      return new Proxy(origModel, {
        get(mTarget, mProp, mReceiver) {
          const fn = Reflect.get(mTarget, mProp, mReceiver);
          const fbFn = fbModel[mProp];
          if (typeof fn !== "function" || typeof fbFn !== "function") return fn;
          return async (...args: any[]) => {
            try {
              return await fn.apply(mTarget, args);
            } catch {
              return fbFn.apply(fbModel, args);
            }
          };
        },
      });
    },
  });
}

export const db: PrismaClient = createResilientDb();
