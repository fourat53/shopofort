import {
	getOrderItemCount,
	getOrderItemsPage,
} from "@/actions/OrderItemActions";
import type { PageProps } from "@/app/admin/[entity]/page";
import DataTableLayout from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { OrderItem } from "@/lib/entity/types";

export default async function OrderItemsPage({
	searchParams,
	header,
}: PageProps) {
	const { page: _page, sortBy, order, ...filterParams } = searchParams;
	const totalCount = await getOrderItemCount(filterParams);
	const { page, totalPages } = getPaginationParams(_page, totalCount);
	const orderItems: OrderItem[] = await getOrderItemsPage(
		page,
		filterParams,
		sortBy,
		order,
	);
	return (
		<DataTableLayout<OrderItem>
			header={header}
			totalPages={totalPages}
			rows={orderItems}
			entity="order-items"
		/>
	);
}
