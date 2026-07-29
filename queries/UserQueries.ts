import { unstable_cache } from "next/cache";
import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import type { User } from "@/lib/generated/prisma/client";
import { CACHE_REVALIDATE_SECONDS, prisma } from "@/lib/prisma";

const USERS_HEADER: string[] = [
	"User ID",
	"Firstname",
	"Lastname",
	"Email",
	"Role",
] as const;

const getUserCount = unstable_cache(
	async () => prisma.user.count(),
	["users-count"],
	{
		revalidate: CACHE_REVALIDATE_SECONDS,
		tags: ["users"],
	},
);

function getUsersPage(page: number) {
	return unstable_cache(
		async () =>
			prisma.user.findMany({
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
				orderBy: { id: "asc" },
				select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					role: true,
				},
			}),
		["users-page", String(page)],
		{ revalidate: CACHE_REVALIDATE_SECONDS, tags: ["users"] },
	)();
}
type UserType = Omit<User, "password">;
type UserCreateType = Omit<UserType, "id" | "createdAt" | "updatedAt">;

export {
	getUserCount,
	getUsersPage,
	USERS_HEADER,
	type UserCreateType,
	type UserType,
};
