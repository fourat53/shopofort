import { getOrderItemsPage } from "@/actions/OrderItemActions";
import DataTable from "@/components/data-table/DataTable";
import type { EntityTableProps } from "@/components/entity-tables/EntityTable";
import { PAGE_SIZE } from "@/components/pagination/PaginationParams";
import type { OrderItem } from "@/lib/entity/types";

export default async function OrderItemsTable({
	entity,
	header,
	page,
	order,
	sortBy,
	filterParams,
	pageSize = PAGE_SIZE,
	sortable,
}: EntityTableProps) {
	const rows: OrderItem[] = await getOrderItemsPage(
		page,
		order,
		sortBy,
		filterParams,
		pageSize,
	);
	return (
		<DataTable<OrderItem>
			header={header}
			rows={rows}
			entity={entity}
			sortable={sortable}
		/>
	);
}
