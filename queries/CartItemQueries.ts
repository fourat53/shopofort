import { unstable_cache } from "next/cache";
import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import type { CartItem } from "@/lib/generated/prisma/client";
import { CACHE_REVALIDATE_SECONDS, prisma } from "@/lib/prisma";

const getCartItemCount = unstable_cache(
	async () => prisma.cartItem.count(),
	["cart-items-count"],
	{ revalidate: CACHE_REVALIDATE_SECONDS, tags: ["cart-items"] },
);

function getCartItemsPage(page: number) {
	return unstable_cache(
		async () => {
			const cartItems = await prisma.cartItem.findMany({
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
		["cart-items-page", String(page)],
		{ revalidate: CACHE_REVALIDATE_SECONDS, tags: ["cart-items"] },
	)();
}

type CartItemType = CartItem;

export { type CartItemType, getCartItemCount, getCartItemsPage };
