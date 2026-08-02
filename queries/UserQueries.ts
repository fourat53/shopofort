import { unstable_cache } from "next/cache";
import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import { CACHE_REVALIDATE_SECONDS, prisma } from "@/lib/prisma";

const USERS_HEADER: string[] = [
	"User ID",
	"Kinde ID",
	"Provided ID",
	"First Name",
	"Last Name",
	"Given Name",
	"Family Name",
	"Username",
	"Email",
	"Email Verified",
	"Picture",
	"Role",
	"Suspended",
	"Total Sign-ins",
	"Failed Sign-ins",
	"Last Signed In",
	"Created On",
	"Organizations",
	"Identities",
	"Created At",
	"Updated At",
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
				omit: { password: true },
				take: PAGE_SIZE,
				orderBy: { id: "asc" },
			}),
		["users-page", String(page)],
		{ revalidate: CACHE_REVALIDATE_SECONDS, tags: ["users"] },
	)();
}

export { getUserCount, getUsersPage, USERS_HEADER };
