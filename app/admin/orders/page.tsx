import {
	DataTableLayout,
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
	getOrderCount,
	getOrdersPage,
	ORDERS_HEADER,
} from "@/queries/OrderQueries";

export default async function OrdersPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const totalCount = await getOrderCount();
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const orders = await getOrdersPage(page);

	return (
		<DataTableLayout
			header={ORDERS_HEADER}
			totalPages={totalPages}
			entityRows={["orders", orders]}
		/>
	);
}
