import { unstable_cache } from "next/cache";
import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import type { CartItem, Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const FILTERED_CACHE_SECONDS = 10;

function buildWhereClause(searchParams: Record<string, string | string[] | undefined>): Prisma.CartItemWhereInput {
	const where: Prisma.CartItemWhereInput = {};
	if (searchParams.id) where.id = Number(searchParams.id);
	if (searchParams.quantity) where.quantity = Number(searchParams.quantity);
	if (searchParams.unitPrice) where.unitPrice = Number(searchParams.unitPrice);
	if (searchParams.totalPrice) where.totalPrice = Number(searchParams.totalPrice);
	if (searchParams.cartId) where.cartId = Number(searchParams.cartId);
	if (searchParams.productId) where.productId = Number(searchParams.productId);
	return where;
}

function getCartItemCount(searchParams: Record<string, string | string[] | undefined> = {}) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => prisma.cartItem.count({ where }),
		["cart-items-count", JSON.stringify(searchParams)],
		{ revalidate: Object.keys(searchParams).length ? FILTERED_CACHE_SECONDS : 3600, tags: ["cart-items"] },
	)();
}

function getCartItemsPage(page: number, searchParams: Record<string, string | string[] | undefined> = {}) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => {
			const cartItems = await prisma.cartItem.findMany({
				where,
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
				orderBy: { id: "asc" },
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
		["cart-items-page", String(page), JSON.stringify(searchParams)],
		{ revalidate: Object.keys(searchParams).length ? FILTERED_CACHE_SECONDS : 3600, tags: ["cart-items"] },
	)();
}

type CartItemType = CartItem;

export { type CartItemType, getCartItemCount, getCartItemsPage };
