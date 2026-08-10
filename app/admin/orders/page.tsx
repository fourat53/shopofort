import DataTableLayout, {
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import { getOrderCount, getOrdersPage } from "@/queries/OrderQueries";
import { ORDERS_HEADER } from "./loading";

export default async function OrdersPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const { page: _pageParam, ...filterParams } = params;
	const totalCount = await getOrderCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const orders = await getOrdersPage(page, filterParams);

	return (
		<DataTableLayout
			header={ORDERS_HEADER}
			totalPages={totalPages}
			entityRows={["orders", orders]}
		/>
	);
}
