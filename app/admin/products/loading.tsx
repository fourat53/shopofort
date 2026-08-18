import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { PRODUCTS_HEADER } from "@/lib/entity/entity-header";

export default function Loading() {
	return <DataTableSkeleton header={PRODUCTS_HEADER} hasImage="multiple" />;
}
