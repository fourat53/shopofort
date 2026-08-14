import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function buildWhereClause(
	searchParams: Record<string, string | string[] | undefined>,
): Prisma.CartWhereInput {
	const where: Prisma.CartWhereInput = {};
	if (searchParams.id) where.id = Number(searchParams.id);
	if (searchParams.totalAmount)
		where.totalAmount = Number(searchParams.totalAmount);
	if (searchParams.userId) where.userId = String(searchParams.userId);
	return where;
}

function getCartCount(
	searchParams: Record<string, string | string[] | undefined> = {},
) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => prisma.cart.count({ where }),
		["carts-count", JSON.stringify(searchParams)],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["carts"],
		},
	)();
}

function getCartsPage(
	page: number,
	searchParams: Record<string, string | string[] | undefined> = {},
) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () =>
			prisma.cart.findMany({
				where,
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
				orderBy: { id: "asc" },
			}),
		["carts-page", String(page), JSON.stringify(searchParams)],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["carts"],
		},
	)();
}

export { getCartCount, getCartsPage };
