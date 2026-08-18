import { getOrderCount, getOrdersPage } from "@/actions/OrderActions";
import DataTable, { type PageProps } from "@/components/data-table/DataTable";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import { ORDERS_HEADER } from "@/lib/entity/entity-header";
import type { Order } from "@/lib/entity/types";

export default async function OrdersPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page: _pageParam, sortBy, order, ...filterParams } = params;

	const totalCount = await getOrderCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const orders: Order[] = await getOrdersPage(page, filterParams, {
		sortBy,
		order,
	});

	const suspenseKey = JSON.stringify(params);
	return (
		<DataTable<Order>
			header={ORDERS_HEADER}
			totalPages={totalPages}
			rows={orders}
			basePath="orders"
			suspenseKey={suspenseKey}
		/>
	);
}
