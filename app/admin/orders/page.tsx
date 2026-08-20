import { getOrderCount, getOrdersPage } from "@/actions/OrderActions";
import DataTableLayout from "@/components/data-table/DataTableLayout";
import {
	getTotalPages,
	type PageProps,
} from "@/components/data-table/PaginationParams";
import { ORDERS_HEADER } from "@/lib/entity/entity-header";
import type { Order } from "@/lib/entity/types";

export default async function OrdersPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page, sortBy, order, ...filterParams } = params;

	const totalCount = await getOrderCount(filterParams);
	const totalPages = getTotalPages(totalCount);

	const orders: Order[] = await getOrdersPage(
		Number(page),
		filterParams,
		sortBy,
		order,
	);

	return (
		<DataTableLayout<Order>
			header={ORDERS_HEADER}
			totalPages={totalPages}
			rows={orders}
			basePath="orders"
			suspenseKey={params}
		/>
	);
}
