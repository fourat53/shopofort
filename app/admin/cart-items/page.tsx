import {
	DataTableLayout,
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
	CART_ITEMS_HEADER,
	type CartItemType,
	getCartItemCount,
	getCartItemsPage,
} from "@/queries/CartItemQueries";

export default async function CartItemsPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const totalCount = await getCartItemCount();
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const items: CartItemType[] = await getCartItemsPage(page);
	return (
		<DataTableLayout<CartItemType>
			header={CART_ITEMS_HEADER}
			totalPages={totalPages}
			rows={items}
			basePath="/cart-items"
		/>
	);
}
