import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import { ORDER_ITEMS_HEADER } from "@/lib/entity/entity-header";
import type { ParameterType } from "@/lib/entity/types";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

type FilterBy = Prisma.OrderItemWhereInput;

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};
	if (filterParams.id) where.id = Number(filterParams.id);
	if (filterParams.quantity) where.quantity = Number(filterParams.quantity);
	if (filterParams.price) where.price = Number(filterParams.price);
	if (filterParams.orderId) where.orderId = Number(filterParams.orderId);
	if (filterParams.productId) where.productId = Number(filterParams.productId);
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
	page: number,
	filterParams: ParameterType = {},
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
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
