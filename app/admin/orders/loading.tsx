import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { ORDERS_HEADER } from "@/queries/OrderQueries";

export default function loading() {
	return <DataTableSkeleton header={ORDERS_HEADER} />;
}
