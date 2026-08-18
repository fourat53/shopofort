import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import { ORDER_ITEMS_HEADER } from "@/lib/entity/entity-header";
import type { ParameterType } from "@/lib/entity/types";
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function buildWhereClause(
	searchParams: ParameterType,
): Prisma.OrderItemWhereInput {
	const where: Prisma.OrderItemWhereInput = {};
	if (searchParams.id) where.id = Number(searchParams.id);
	if (searchParams.quantity) where.quantity = Number(searchParams.quantity);
	if (searchParams.price) where.price = Number(searchParams.price);
	if (searchParams.orderId) where.orderId = Number(searchParams.orderId);
	if (searchParams.productId) where.productId = Number(searchParams.productId);
	return where;
}

function buildOrderClause(
	orderParams: ParameterType,
): Prisma.OrderItemOrderByWithRelationInput {
	const sortBy =
		typeof orderParams.sortBy === "string" ? orderParams.sortBy : undefined;
	const order = orderParams.order === "desc" ? "desc" : "asc";

	const sortableColumns = new Set<
		keyof Prisma.OrderItemOrderByWithRelationInput
	>(
		ORDER_ITEMS_HEADER.map(
			(header) => header.name as keyof Prisma.OrderItemOrderByWithRelationInput,
		),
	);

	if (
		sortBy &&
		sortableColumns.has(
			sortBy as keyof Prisma.OrderItemOrderByWithRelationInput,
		)
	)
		return {
			[sortBy]: order,
		} as Prisma.OrderItemOrderByWithRelationInput;
	return { id: "asc" };
}

function getOrderItemsPage(
	page: number,
	searchParams: ParameterType = {},
	orderParams: ParameterType = {},
) {
	const where = buildWhereClause(searchParams);
	const orderBy = buildOrderClause(orderParams);
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
			JSON.stringify(searchParams),
			JSON.stringify(orderParams),
		],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["order-items"],
		},
	)();
}

function getOrderItemCount(searchParams: ParameterType = {}) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => prisma.orderItem.count({ where }),
		["order-items-count", JSON.stringify(searchParams)],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["order-items"],
		},
	)();
}

export { getOrderItemCount, getOrderItemsPage };
