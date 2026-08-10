import DataTableLayout, {
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import { getCartItemCount, getCartItemsPage } from "@/queries/CartItemQueries";
import { CART_ITEMS_HEADER } from "./loading";

export default async function CartItemsPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const { page: _pageParam, ...filterParams } = params;
	const totalCount = await getCartItemCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const cartItems = await getCartItemsPage(page, filterParams);
	return (
		<DataTableLayout
			header={CART_ITEMS_HEADER}
			totalPages={totalPages}
			entityRows={["cart-items", cartItems]}
		/>
	);
}
