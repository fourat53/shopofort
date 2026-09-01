import { getCategoriesPage } from "@/actions/CategoryActions";
import DataTable from "@/components/data-table/DataTable";
import type { EntityTableProps } from "@/components/entity-tables/EntityTable";
import type { Category } from "@/lib/entity/types";

export default async function CategoriesTable({
	entity,
	header,
	page,
	order,
	sortBy,
	filterParams,
	pageSize,
	dialog,
}: EntityTableProps) {
	const rows: Category[] = await getCategoriesPage(
		page,
		order,
		sortBy,
		filterParams,
		pageSize,
	);
	return (
		<DataTable<Category>
			header={header}
			rows={rows}
			entity={entity}
			dialog={dialog}
		/>
	);
}
