import { getCartItemsPage } from "@/actions/CartItemActions";
import DataTable from "@/components/data-table/DataTable";
import type { EntityTableProps } from "@/components/entity-tables/EntityTable";
import { PAGE_SIZE } from "@/components/pagination/PaginationParams";
import type { CartItem } from "@/lib/entity/types";

export default async function CartItemsTable({
	entity,
	header,
	page,
	order,
	sortBy,
	filterParams,
	pageSize = PAGE_SIZE,
	sortable,
}: EntityTableProps) {
	const rows: CartItem[] = await getCartItemsPage(
		page,
		order,
		sortBy,
		filterParams,
		pageSize,
	);
	return (
		<DataTable<CartItem>
			header={header}
			rows={rows}
			entity={entity}
			sortable={sortable}
		/>
	);
}
