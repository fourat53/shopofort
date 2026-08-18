import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import { CART_ITEMS_HEADER } from "@/lib/entity/entity-header";
import type { ParameterType } from "@/lib/entity/types";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

function buildWhereClause(
	searchParams: ParameterType,
): Prisma.CartItemWhereInput {
	const where: Prisma.CartItemWhereInput = {};
	if (searchParams.id) where.id = Number(searchParams.id);
	if (searchParams.quantity) where.quantity = Number(searchParams.quantity);
	if (searchParams.unitPrice) where.unitPrice = Number(searchParams.unitPrice);
	if (searchParams.totalPrice)
		where.totalPrice = Number(searchParams.totalPrice);
	if (searchParams.cartId) where.cartId = Number(searchParams.cartId);
	if (searchParams.productId) where.productId = Number(searchParams.productId);
	return where;
}

function buildOrderClause(
	orderParams: ParameterType,
): Prisma.CartItemOrderByWithRelationInput {
	const sortBy =
		typeof orderParams.sortBy === "string" ? orderParams.sortBy : undefined;
	const order = orderParams.order === "desc" ? "desc" : "asc";

	const sortableColumns = new Set<
		keyof Prisma.CartItemOrderByWithRelationInput
	>(
		CART_ITEMS_HEADER.map(
			(header) => header.name as keyof Prisma.CartItemOrderByWithRelationInput,
		),
	);
	if (
		sortBy &&
		sortableColumns.has(sortBy as keyof Prisma.CartItemOrderByWithRelationInput)
	)
		return {
			[sortBy]: order,
		} as Prisma.CartItemOrderByWithRelationInput;
	return { id: "asc" };
}

function getCartItemsPage(
	page: number,
	searchParams: ParameterType = {},
	orderParams: ParameterType = {},
) {
	const where = buildWhereClause(searchParams);
	const orderBy = buildOrderClause(orderParams);
	return unstable_cache(
		async () => {
			const cartItems = await prisma.cartItem.findMany({
				where,
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
				orderBy,
			});
			return cartItems.map(
				({ id, quantity, unitPrice, totalPrice, ...rest }) => ({
					id,
					unitPrice: Number(unitPrice),
					quantity,
					totalPrice: Number(totalPrice),
					...rest,
				}),
			);
		},
		[
			"cart-items-page",
			String(page),
			JSON.stringify(searchParams),
			JSON.stringify(orderParams),
		],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["cart-items"],
		},
	)();
}

function getCartItemCount(searchParams: ParameterType = {}) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => prisma.cartItem.count({ where }),
		["cart-items-count", JSON.stringify(searchParams)],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["cart-items"],
		},
	)();
}

export { getCartItemCount, getCartItemsPage };
