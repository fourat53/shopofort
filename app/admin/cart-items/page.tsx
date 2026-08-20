import { getCartItemCount, getCartItemsPage } from "@/actions/CartItemActions";
import DataTableLayout from "@/components/data-table/DataTableLayout";
import {
	getTotalPages,
	type PageProps,
} from "@/components/data-table/PaginationParams";
import { CART_ITEMS_HEADER } from "@/lib/entity/entity-header";
import type { CartItem } from "@/lib/entity/types";

export default async function CartItemsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page, sortBy, order, ...filterParams } = params;

	const totalCount = await getCartItemCount(filterParams);
	const totalPages = getTotalPages(totalCount);

	const cartItems: CartItem[] = await getCartItemsPage(
		Number(page),
		filterParams,
		sortBy,
		order,
	);

	return (
		<DataTableLayout<CartItem>
			header={CART_ITEMS_HEADER}
			totalPages={totalPages}
			rows={cartItems}
			basePath="cart-items"
			suspenseKey={params}
		/>
	);
}
