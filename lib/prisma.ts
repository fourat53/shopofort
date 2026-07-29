import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = global as unknown as {
	prisma: PrismaClient;
};

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		adapter,
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const CACHE_REVALIDATE_SECONDS = 300;

export { CACHE_REVALIDATE_SECONDS, prisma };
