import { getCartItemCount, getCartItemsPage } from "@/actions/CartItemActions";
import type { PageProps } from "@/app/admin/[entity]/page";
import DataTableLayout from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { CartItem } from "@/lib/entity/types";

export default async function CartItemsPage({
	searchParams,
	header,
}: PageProps) {
	const { page: _page, sortBy, order, ...filterParams } = searchParams;
	const totalCount = await getCartItemCount(filterParams);
	const { page, totalPages } = getPaginationParams(_page, totalCount);
	const cartItems: CartItem[] = await getCartItemsPage(
		page,
		filterParams,
		sortBy,
		order,
	);
	return (
		<DataTableLayout<CartItem>
			header={header}
			totalPages={totalPages}
			rows={cartItems}
			entity="cart-items"
		/>
	);
}
