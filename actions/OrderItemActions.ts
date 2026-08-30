import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	PAGE_SIZE,
} from "@/components/pagination/PaginationParams";
import { getParamValues } from "@/lib/entity/entity-functions";
import { ORDER_ITEMS_HEADER } from "@/lib/entity/entity-header";
import type { ParameterType } from "@/lib/entity/types";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

type FilterBy = Prisma.OrderItemWhereInput;

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};

	for (const field of ["quantity", "price"] as const) {
		const from = Number(filterParams[`${field}From`]);
		const to = Number(filterParams[`${field}To`]);
		if (!Number.isNaN(from) || !Number.isNaN(to)) {
			const range: { gte?: number; lte?: number } = {};
			if (!Number.isNaN(from)) range.gte = from;
			if (!Number.isNaN(to)) range.lte = to;
			where[field] = range;
		}
	}

	for (const field of ["id", "orderId", "productId"] as const) {
		const values = getParamValues(filterParams[field]);
		if (values.length) where[field] = { in: values.map(Number) };
	}

	return where;
}

type OrderBy = Prisma.OrderItemOrderByWithRelationInput;

function buildOrderClause(
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
): OrderBy {
	const sortableColumns = new Set<keyof OrderBy>(
		ORDER_ITEMS_HEADER.map((header) => header.name as keyof OrderBy),
	);
	if (sortableColumns.has(sortBy as keyof OrderBy))
		return { [sortBy]: order } as OrderBy;
	return { id: "asc" };
}

function getOrderItemsPage(
	page: number = 1,
	order: "asc" | "desc" = "asc",
	sortBy: string = "id",
	filterParams: ParameterType = {},
) {
	const where = buildWhereClause(filterParams);
	const orderBy = buildOrderClause(sortBy, order);
	return unstable_cache(
		async () => {
			const orderItems = await prisma.orderItem.findMany({
				where,
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
				orderBy,
			});
			return orderItems.map(({ id, price, ...rest }) => ({
				id,
				price: Number(price),
				...rest,
			}));
		},
		[
			"order-items-page",
			String(page),
			JSON.stringify(filterParams),
			JSON.stringify({ sortBy, order }),
		],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["order-items"],
		},
	)();
}

function getOrderItemCount(filterParams: ParameterType = {}) {
	const where = buildWhereClause(filterParams);
	return unstable_cache(
		async () => prisma.orderItem.count({ where }),
		["order-items-count", JSON.stringify(filterParams)],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["order-items"],
		},
	)();
}

export { getOrderItemCount, getOrderItemsPage };
