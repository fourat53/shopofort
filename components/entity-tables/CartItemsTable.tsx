import { getCartItemsPage } from "@/actions/CartItemActions";
import type { EntityTableProps } from "@/app/admin/[entity]/page";
import DataTable from "@/components/data-table/DataTable";
import type { CartItem } from "@/lib/entity/types";

export default async function CartItemsTable({
	entity,
	header,
	page,
	order,
	sortBy,
	filterParams,
}: EntityTableProps) {
	const rows: CartItem[] = await getCartItemsPage(
		page,
		order,
		sortBy,
		filterParams,
	);
	return <DataTable<CartItem> header={header} rows={rows} entity={entity} />;
}
