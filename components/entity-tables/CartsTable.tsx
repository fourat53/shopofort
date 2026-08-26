import { getCartsPage } from "@/actions/CartActions";
import type { EntityTableProps } from "@/app/admin/[entity]/page";
import DataTable from "@/components/data-table/DataTable";
import type { Cart } from "@/lib/entity/types";

export default async function CartsTable({
	entity,
	header,
	page,
	order,
	sortBy,
	filterParams,
}: EntityTableProps) {
	const rows: Cart[] = await getCartsPage(page, order, sortBy, filterParams);
	return <DataTable<Cart> header={header} rows={rows} entity={entity} />;
}
