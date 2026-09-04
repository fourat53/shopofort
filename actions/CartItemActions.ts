"use server";

import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	PAGE_SIZE,
} from "@/components/data-table/pagination/PaginationParams";
import { getParamValues } from "@/lib/entity/functions";
import { CART_ITEMS_HEADER } from "@/lib/entity/headers";
import type { ParameterType } from "@/lib/entity/types";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

type FilterBy = Prisma.CartItemWhereInput;

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};

	for (const field of ["quantity", "unitPrice", "totalPrice"] as const) {
		const from = Number(filterParams[`${field}From`]);
		const to = Number(filterParams[`${field}To`]);
		if (!Number.isNaN(from) || !Number.isNaN(to)) {
			const range: { gte?: number; lte?: number } = {};
			if (!Number.isNaN(from)) range.gte = from;
			if (!Number.isNaN(to)) range.lte = to;
			where[field] = range;
		}
	}

	for (const field of ["id", "cartId", "productId"] as const) {
		const values = getParamValues(filterParams[field]);
		if (values.length) where[field] = { in: values.map(Number) };
	}

	return where;
}

type OrderBy = Prisma.CartItemOrderByWithRelationInput;

function buildOrderClause(
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
): OrderBy {
	const sortableColumns = new Set<keyof OrderBy>(
		CART_ITEMS_HEADER.map((header) => header.name as keyof OrderBy),
	);
	if (sortableColumns.has(sortBy as keyof OrderBy))
		return { [sortBy]: order } as OrderBy;
	return { id: "asc" };
}

async function getCartItemsPage(
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
			const cartItems = await prisma.cartItem.findMany({
				where,
				skip: (page - 1) * pageSize,
				take: pageSize,
				orderBy,
				include: { cart: true, product: true },
			});
			return JSON.parse(JSON.stringify(cartItems));
		},
		[
			"cart-items-page",
			String(page),
			JSON.stringify(filterParams),
			JSON.stringify({ sortBy, order }),
		],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["cart-items"],
		},
	)();
}

async function getCartItemCount(filterParams: ParameterType = {}) {
	const where = buildWhereClause(filterParams);
	return unstable_cache(
		() => prisma.cartItem.count({ where }),
		["cart-items-count", JSON.stringify(filterParams)],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["cart-items"],
		},
	)();
}

export { getCartItemCount, getCartItemsPage };
