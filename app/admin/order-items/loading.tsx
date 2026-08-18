import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { ORDER_ITEMS_HEADER } from "@/lib/entity/entity-header";

export default function Loading() {
	return <DataTableSkeleton header={ORDER_ITEMS_HEADER} />;
}
