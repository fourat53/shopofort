import DataTable, { type PageProps } from "@/components/data-table/DataTable";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { CartItem } from "@/lib/types";
import { getCartItemCount, getCartItemsPage } from "@/queries/CartItemQueries";
import { CART_ITEMS_HEADER } from "./loading";

export default async function CartItemsPage({ searchParams }: PageProps) {
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
