import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { CATEGORIES_HEADER } from "@/queries/CategoryQueries";

export default function loading() {
	return <DataTableSkeleton header={CATEGORIES_HEADER} />;
}
