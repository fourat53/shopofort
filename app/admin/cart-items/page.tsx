import { getCartItemCount, getCartItemsPage } from "@/actions/CartItemActions";
import DataTable, { type PageProps } from "@/components/data-table/DataTable";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import { CART_ITEMS_HEADER } from "@/lib/entity/entity-headers";
import type { CartItem } from "@/lib/entity/types";

export default async function CartItemsPage({ searchParams }: PageProps) {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const params = await searchParams;
	const { page: _pageParam, ...filterParams } = params;

	const totalCount = await getCartItemCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const cartItems: CartItem[] = await getCartItemsPage(page, filterParams);
	return (
		<DataTable<CartItem>
			header={CART_ITEMS_HEADER}
			totalPages={totalPages}
			rows={cartItems}
			basePath="cart-items"
		/>
	);
}
