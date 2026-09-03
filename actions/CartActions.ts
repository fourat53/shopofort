import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	PAGE_SIZE,
} from "@/components/pagination/PaginationParams";
import { getParamValues } from "@/lib/entity/entity-functions";
import { CARTS_HEADER } from "@/lib/entity/entity-header";
import type { ParameterType } from "@/lib/entity/types";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

type FilterBy = Prisma.CartWhereInput;

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};

	const ids = getParamValues(filterParams.id);
	if (ids.length) where.id = { in: ids.map(Number) };

	const from = Number(filterParams.totalAmountFrom);
	const to = Number(filterParams.totalAmountTo);
	if (!Number.isNaN(from) || !Number.isNaN(to)) {
		const range: { gte?: number; lte?: number } = {};
		if (!Number.isNaN(from)) range.gte = from;
		if (!Number.isNaN(to)) range.lte = to;
		where.totalAmount = range;
	}

	const userIds = getParamValues(filterParams.userId);
	if (userIds.length) where.userId = { in: userIds };

	return where;
}

type OrderBy = Prisma.CartOrderByWithRelationInput;

function buildOrderClause(
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
): OrderBy {
	const sortableColumns = new Set<keyof OrderBy>(
		CARTS_HEADER.map((header) => header.name as keyof OrderBy),
	);
	if (sortableColumns.has(sortBy as keyof OrderBy))
		return { [sortBy]: order } as OrderBy;
	return { id: "asc" };
}

async function getCartsPage(
	page: number = 1,
	order: "asc" | "desc" = "asc",
	sortBy: string = "id",
	filterParams: ParameterType = {},
	pageSize: number = PAGE_SIZE,
) {
	const where = buildWhereClause(filterParams);
	const orderBy = buildOrderClause(sortBy, order);
	return unstable_cache(
		async () => {
			const carts = await prisma.cart.findMany({
				where,
				skip: (page - 1) * pageSize,
				take: pageSize,
				orderBy,
				include: { cartItems: true },
			});
			return JSON.parse(JSON.stringify(carts));
		},
		[
			"carts-page",
			String(page),
			JSON.stringify(filterParams),
			JSON.stringify({ sortBy, order }),
		],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["carts"],
		},
	)();
}

async function getCartCount(filterParams: ParameterType = {}) {
	const where = buildWhereClause(filterParams);
	return unstable_cache(
		() => prisma.cart.count({ where }),
		["carts-count", JSON.stringify(filterParams)],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["carts"],
		},
	)();
}

export { getCartCount, getCartsPage };
