import {
	getOrderItemCount,
	getOrderItemsPage,
} from "@/actions/OrderItemActions";
import DataTableLayout from "@/components/data-table/DataTableLayout";
import {
	getTotalPages,
	type PageProps,
} from "@/components/data-table/PaginationParams";
import { ORDER_ITEMS_HEADER } from "@/lib/entity/entity-header";
import type { OrderItem } from "@/lib/entity/types";

export default async function OrderItemsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page, sortBy, order, ...filterParams } = params;

	const totalCount = await getOrderItemCount(filterParams);
	const totalPages = getTotalPages(totalCount);

	const orderItems: OrderItem[] = await getOrderItemsPage(
		Number(page),
		filterParams,
		sortBy,
		order,
	);

	return (
		<DataTableLayout<OrderItem>
			header={ORDER_ITEMS_HEADER}
			totalPages={totalPages}
			rows={orderItems}
			basePath="order-items"
			suspenseKey={params}
		/>
	);
}
