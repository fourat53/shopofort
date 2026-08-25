import { getOrderCount, getOrdersPage } from "@/actions/OrderActions";
import type { PageProps } from "@/app/admin/[entity]/page";
import DataTableLayout from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { Order } from "@/lib/entity/types";

export default async function OrdersPage({ searchParams, header }: PageProps) {
	const { page: _page, sortBy, order, ...filterParams } = searchParams;
	const totalCount = await getOrderCount(filterParams);
	const { page, totalPages } = getPaginationParams(_page, totalCount);
	const orders: Order[] = await getOrdersPage(
		page,
		filterParams,
		sortBy,
		order,
	);
	return (
		<DataTableLayout<Order>
			header={header}
			totalPages={totalPages}
			rows={orders}
			entity="orders"
		/>
	);
}
