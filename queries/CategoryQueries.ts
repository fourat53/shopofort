import { unstable_cache } from "next/cache";
import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import type { Category } from "@/lib/generated/prisma/client";
import { CACHE_REVALIDATE_SECONDS, prisma } from "@/lib/prisma";

const getCategoryCount = unstable_cache(
	async () => prisma.category.count(),
	["categories-count"],
	{ revalidate: CACHE_REVALIDATE_SECONDS, tags: ["categories"] },
);

function getCategoriesPage(page: number) {
	return unstable_cache(
		async () =>
			prisma.category.findMany({
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
				orderBy: { id: "asc" },
			}),
		["categories-page", String(page)],
		{ revalidate: CACHE_REVALIDATE_SECONDS, tags: ["categories"] },
	)();
}

type CategoryType = Category;

export { type CategoryType, getCategoriesPage, getCategoryCount };
