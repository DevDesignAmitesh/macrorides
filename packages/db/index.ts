import { getEnv } from "./env.js";
import {
  PrismaClient,
  vendorType,
  kitchenState,
  operationalState,
  locationLabel,
} from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient | null };

let prisma: PrismaClient | null = null;

if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg({
    connectionString: getEnv().DATABASE_URL,
  });

  prisma = new PrismaClient({ adapter });
} else if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { vendorType, kitchenState, operationalState, locationLabel, prisma };
