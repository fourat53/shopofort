import DataTableLayout, {
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
	getOrderItemCount,
	getOrderItemsPage,
} from "@/queries/OrderItemQueries";
import { ORDER_ITEMS_HEADER } from "./loading";

export default async function OrderItemsPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const { page: _pageParam, ...filterParams } = params;
	const totalCount = await getOrderItemCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const orderItems = await getOrderItemsPage(page, filterParams);
	return (
		<DataTableLayout
			header={ORDER_ITEMS_HEADER}
			totalPages={totalPages}
			entityRows={["order-items", orderItems]}
		/>
	);
}
