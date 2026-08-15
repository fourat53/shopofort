import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { ORDERS_HEADER } from "@/lib/entity/entity-headers";

export default function Loading() {
	return <DataTableSkeleton header={ORDERS_HEADER} />;
}
