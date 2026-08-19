import { getCartCount, getCartsPage } from "@/actions/CartActions";
import DataTable from "@/components/data-table/DataTable";
import {
	getPaginationParams,
	type PageProps,
} from "@/components/data-table/PaginationParams";
import { CARTS_HEADER } from "@/lib/entity/entity-header";
import type { Cart } from "@/lib/entity/types";

export default async function CartsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { sortBy, order, ...filterParams } = params;

	const totalCount = await getCartCount(filterParams);
	const { page, totalPages } = getPaginationParams(params.page, totalCount);

	const carts: Cart[] = await getCartsPage(page, filterParams, sortBy, order);

	return (
		<DataTable<Cart>
			header={CARTS_HEADER}
			totalPages={totalPages}
			rows={carts}
			basePath="carts"
			suspenseKey={params}
		/>
	);
}
