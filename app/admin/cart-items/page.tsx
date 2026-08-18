import { getCartItemCount, getCartItemsPage } from "@/actions/CartItemActions";
import DataTable, { type PageProps } from "@/components/data-table/DataTable";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import { CART_ITEMS_HEADER } from "@/lib/entity/entity-header";
import type { CartItem } from "@/lib/entity/types";

export default async function CartItemsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page: _pageParam, sortBy, order, ...filterParams } = params;

	const totalCount = await getCartItemCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const cartItems: CartItem[] = await getCartItemsPage(page, filterParams, {
		sortBy,
		order,
	});

	const suspenseKey = JSON.stringify(params);
	return (
		<DataTable<CartItem>
			header={CART_ITEMS_HEADER}
			totalPages={totalPages}
			rows={cartItems}
			basePath="cart-items"
			suspenseKey={suspenseKey}
		/>
	);
}
