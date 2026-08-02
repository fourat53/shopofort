import { unstable_cache } from "next/cache";
import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import { CACHE_REVALIDATE_SECONDS, prisma } from "@/lib/prisma";

const USERS_HEADER: string[] = [
	"User ID",
	"Picture",
	"First Name",
	"Last Name",
	"Username",
	"Email",
	"Email Verified",
	"Role",
	"Suspended",
	"Total Sign-ins",
	"Failed Sign-ins",
	"Last Signed In",
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
		async () => {
			const users = await prisma.user.findMany({
				skip: (page - 1) * PAGE_SIZE,
				omit: {
					kindeId: true,
					providedId: true,
					givenName: true,
					familyName: true,
					password: true,
					createdOn: true,
					organizations: true,
					identities: true,
				},
				take: PAGE_SIZE,
				orderBy: { id: "asc" },
			});

			return users.map(({ id, picture, ...rest }) => ({
				id,
				picture,
				...rest,
			}));
		},
		["users-page", String(page)],
		{ revalidate: CACHE_REVALIDATE_SECONDS, tags: ["users"] },
	)();
}

export { getUserCount, getUsersPage, USERS_HEADER };
