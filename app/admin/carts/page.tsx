import DataTable, { type PageProps } from "@/components/data-table/DataTable";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { Cart } from "@/lib/types";
import { getCartCount, getCartsPage } from "@/queries/CartQueries";
import { CARTS_HEADER } from "./loading";

export default async function CartsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page: _pageParam, ...filterParams } = params;

	const totalCount = await getCartCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const carts: Cart[] = await getCartsPage(page, filterParams);

	return (
		<DataTable<Cart>
			header={CARTS_HEADER}
			totalPages={totalPages}
			rows={carts}
			basePath="carts"
		/>
	);
}
