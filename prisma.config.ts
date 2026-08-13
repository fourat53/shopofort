import "dotenv/config";
import { defineConfig } from "prisma/config";
import { checkedEnvVar } from "./lib/checked-env-var";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: `tsx prisma/seed.ts`,
	},
	datasource: {
		url: checkedEnvVar("DATABASE_URL"),
		shadowDatabaseUrl: checkedEnvVar("SHADOW_DATABASE_URL"),
	},
});
