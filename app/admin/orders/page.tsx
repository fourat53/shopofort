import { getOrderCount, getOrdersPage } from "@/actions/OrderActions";
import DataTable from "@/components/data-table/DataTable";
import {
	getPaginationParams,
	type PageProps,
} from "@/components/data-table/PaginationParams";
import { ORDERS_HEADER } from "@/lib/entity/entity-header";
import type { Order } from "@/lib/entity/types";

export default async function OrdersPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { sortBy, order, ...filterParams } = params;

	const totalCount = await getOrderCount(filterParams);
	const { page, totalPages } = getPaginationParams(params.page, totalCount);

	const orders: Order[] = await getOrdersPage(
		page,
		filterParams,
		sortBy,
		order,
	);

	return (
		<DataTable<Order>
			header={ORDERS_HEADER}
			totalPages={totalPages}
			rows={orders}
			basePath="orders"
			suspenseKey={params}
		/>
	);
}
