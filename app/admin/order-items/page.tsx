import {
	DataTableLayout,
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
	getOrderItemCount,
	getOrderItemsPage,
	ORDER_ITEMS_HEADER,
	type OrderItemType,
} from "@/queries/OrderItemQueries";

export default async function OrderItemsPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const totalCount = await getOrderItemCount();
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const items: OrderItemType[] = await getOrderItemsPage(page);
	return (
		<DataTableLayout<OrderItemType>
			header={ORDER_ITEMS_HEADER}
			totalPages={totalPages}
			rows={items}
			basePath="/order-items"
		/>
	);
}
