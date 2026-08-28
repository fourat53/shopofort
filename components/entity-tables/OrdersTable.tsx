import { getOrdersPage } from "@/actions/OrderActions";
import DataTable from "@/components/data-table/DataTable";
import type { EntityTableProps } from "@/components/entity-tables/EntityTable";
import type { Order } from "@/lib/entity/types";

export default async function OrdersTable({
	entity,
	header,
	page,
	order,
	sortBy,
	filterParams,
}: EntityTableProps) {
	const rows: Order[] = await getOrdersPage(page, order, sortBy, filterParams);
	return <DataTable<Order> header={header} rows={rows} entity={entity} />;
}
