import { getOrderCount, getOrdersPage } from "@/actions/OrderActions";
import DataTable, { type PageProps } from "@/components/data-table/DataTable";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { Order } from "@/lib/entity/types";
import { ORDERS_HEADER } from "./loading";

export default async function OrdersPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page: _pageParam, ...filterParams } = params;

	const totalCount = await getOrderCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const orders: Order[] = await getOrdersPage(page, filterParams);

	return (
		<DataTable<Order>
			header={ORDERS_HEADER}
			totalPages={totalPages}
			rows={orders}
			basePath="orders"
		/>
	);
}
