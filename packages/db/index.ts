import { getEnv } from "./env.js";
import {
  PrismaClient,
  vendorType,
  kitchenState,
  operationalState,
  locationLabel,
} from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg({
    connectionString: getEnv().DATABASE_URL,
  });

  prisma = new PrismaClient({ adapter });
  globalForPrisma.prisma = prisma;
} else {
  prisma = globalForPrisma.prisma;
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { vendorType, kitchenState, operationalState, locationLabel, prisma };
