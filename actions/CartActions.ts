import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import { CARTS_HEADER } from "@/lib/entity/entity-header";
import type { ParameterType } from "@/lib/entity/types";
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function buildWhereClause(searchParams: ParameterType): Prisma.CartWhereInput {
	const where: Prisma.CartWhereInput = {};
	if (searchParams.id) where.id = Number(searchParams.id);
	if (searchParams.totalAmount)
		where.totalAmount = Number(searchParams.totalAmount);
	if (searchParams.userId) where.userId = String(searchParams.userId);
	return where;
}

function buildOrderClause(
	orderParams: ParameterType,
): Prisma.CartOrderByWithRelationInput {
	const sortBy =
		typeof orderParams.sortBy === "string" ? orderParams.sortBy : undefined;
	const order = orderParams.order === "desc" ? "desc" : "asc";

	const sortableColumns = new Set<keyof Prisma.CartOrderByWithRelationInput>(
		CARTS_HEADER.map(
			(header) => header.name as keyof Prisma.CartOrderByWithRelationInput,
		),
	);

	if (
		sortBy &&
		sortableColumns.has(sortBy as keyof Prisma.CartOrderByWithRelationInput)
	)
		return {
			[sortBy]: order,
		} as Prisma.CartOrderByWithRelationInput;
	return { id: "asc" };
}

function getCartsPage(
	page: number,
	searchParams: ParameterType = {},
	orderParams: ParameterType = {},
) {
	const where = buildWhereClause(searchParams);
	const orderBy = buildOrderClause(orderParams);
	return unstable_cache(
		async () =>
			prisma.cart.findMany({
				where,
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
				orderBy,
			}),
		[
			"carts-page",
			String(page),
			JSON.stringify(searchParams),
			JSON.stringify(orderParams),
		],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["carts"],
		},
	)();
}

function getCartCount(searchParams: ParameterType = {}) {
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

export { getCartCount, getCartsPage };
