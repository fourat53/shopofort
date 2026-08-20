import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { checkedEnvVar } from "./checked-env-var";

const globalForPrisma = global as unknown as {
	prisma: PrismaClient;
};

const adapter = new PrismaPg({
	connectionString: checkedEnvVar("DATABASE_URL"),
});

const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		adapter,
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
