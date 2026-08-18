import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { CATEGORIES_HEADER } from "@/lib/entity/entity-header";

export default function Loading() {
	return <DataTableSkeleton header={CATEGORIES_HEADER} />;
}
