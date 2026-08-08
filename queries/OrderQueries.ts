import { unstable_cache } from "next/cache";
import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import { CACHE_REVALIDATE_SECONDS, prisma } from "@/lib/prisma";

const getOrderCount = unstable_cache(
	async () => prisma.order.count(),
	["orders-count"],
	{ revalidate: CACHE_REVALIDATE_SECONDS, tags: ["orders"] },
);

function getOrdersPage(page: number) {
	return unstable_cache(
		async () => {
			return await prisma.order.findMany({
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
				orderBy: { id: "asc" },
			});
		},
		["orders-page", String(page)],
		{ revalidate: CACHE_REVALIDATE_SECONDS, tags: ["orders"] },
	)();
}

export { getOrderCount, getOrdersPage };
