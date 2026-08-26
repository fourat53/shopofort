import { getProductsPage } from "@/actions/ProductActions";
import type { EntityTableProps } from "@/app/admin/[entity]/page";
import DataTable from "@/components/data-table/DataTable";
import type { Product } from "@/lib/entity/types";

export default async function ProductsTable({
	entity,
	header,
	page,
	order,
	sortBy,
	filterParams,
}: EntityTableProps) {
	const rows: Product[] = await getProductsPage(
		page,
		order,
		sortBy,
		filterParams,
	);
	return <DataTable<Product> header={header} rows={rows} entity={entity} />;
}
