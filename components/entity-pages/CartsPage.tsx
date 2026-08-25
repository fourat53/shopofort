import { getCartCount, getCartsPage } from "@/actions/CartActions";
import type { PageProps } from "@/app/admin/[entity]/page";
import DataTableLayout from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { Cart } from "@/lib/entity/types";

export default async function CartsPage({ searchParams, header }: PageProps) {
	const { page: _page, sortBy, order, ...filterParams } = searchParams;
	const totalCount = await getCartCount(filterParams);
	const { page, totalPages } = getPaginationParams(_page, totalCount);
	const carts: Cart[] = await getCartsPage(page, filterParams, sortBy, order);
	return (
		<DataTableLayout<Cart>
			header={header}
			totalPages={totalPages}
			rows={carts}
			entity="carts"
		/>
	);
}
