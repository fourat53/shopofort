import { getCartsPage } from "@/actions/CartActions";
import DataTable from "@/components/data-table/DataTable";
import type { EntityTableProps } from "@/components/entity-tables/EntityTable";
import type { Cart } from "@/lib/entity/types";

export default async function CartsTable({
	entity,
	header,
	page,
	order,
	sortBy,
	filterParams,
	pageSize,
	dialog,
}: EntityTableProps) {
	const rows: Cart[] = await getCartsPage(
		page,
		order,
		sortBy,
		filterParams,
		pageSize,
	);
	return (
		<DataTable<Cart>
			header={header}
			rows={rows}
			entity={entity}
			dialog={dialog}
		/>
	);
}
