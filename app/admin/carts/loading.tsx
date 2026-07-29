import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { CARTS_HEADER } from "@/queries/CartQueries";

export default function loading() {
	return <DataTableSkeleton header={CARTS_HEADER} />;
}
