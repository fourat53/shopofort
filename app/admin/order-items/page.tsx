import {
	getOrderItemCount,
	getOrderItemsPage,
} from "@/actions/OrderItemActions";
import DataTable, { type PageProps } from "@/components/data-table/DataTable";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { OrderItem } from "@/lib/entity/types";
import { ORDER_ITEMS_HEADER } from "./loading";

export default async function OrderItemsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page: _pageParam, ...filterParams } = params;

	const totalCount = await getOrderItemCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const orderItems: OrderItem[] = await getOrderItemsPage(page, filterParams);
	return (
		<DataTable<OrderItem>
			header={ORDER_ITEMS_HEADER}
			totalPages={totalPages}
			rows={orderItems}
			basePath="order-items"
		/>
	);
}
