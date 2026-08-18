import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { CARTS_HEADER } from "@/lib/entity/entity-header";

export default function Loading() {
	return <DataTableSkeleton header={CARTS_HEADER} />;
}
