import { Suspense } from "react";
import { getOrderCount, getOrdersPage } from "@/actions/OrderActions";
import DataTable, { type PageProps } from "@/components/data-table/DataTable";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { Order } from "@/lib/entity/types";

export const ORDERS_HEADER: string[] = [
	"Order ID",
	"Order Date",
	"Total Amount",
	"Order Status",
	"User ID",
] as const;

export default async function OrdersPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page: _pageParam, ...filterParams } = params;

	const totalCount = await getOrderCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const orders: Order[] = await getOrdersPage(page, filterParams);

	return (
		<Suspense
			key={_pageParam}
			fallback={<DataTableSkeleton header={ORDERS_HEADER} />}
		>
			<DataTable<Order>
				header={ORDERS_HEADER}
				totalPages={totalPages}
				rows={orders}
				basePath="orders"
			/>
		</Suspense>
	);
}
