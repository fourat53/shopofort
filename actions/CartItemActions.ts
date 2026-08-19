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

type FilterBy = Prisma.CartItemWhereInput;

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};
	if (filterParams.id) where.id = Number(filterParams.id);
	if (filterParams.quantity) where.quantity = Number(filterParams.quantity);
	if (filterParams.unitPrice) where.unitPrice = Number(filterParams.unitPrice);
	if (filterParams.totalPrice)
		where.totalPrice = Number(filterParams.totalPrice);
	if (filterParams.cartId) where.cartId = Number(filterParams.cartId);
	if (filterParams.productId) where.productId = Number(filterParams.productId);
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

function getCartItemsPage(
	page: number = 1,
	filterParams: ParameterType = {},
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
) {
	const where = buildWhereClause(filterParams);
	const orderBy = buildOrderClause(sortBy, order);
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

function getCartItemCount(filterParams: ParameterType = {}) {
	const where = buildWhereClause(filterParams);
	return unstable_cache(
		async () => prisma.cartItem.count({ where }),
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
