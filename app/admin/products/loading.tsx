import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { PRODUCTS_HEADER } from "@/queries/ProductQueries";

export default function loading() {
	return <DataTableSkeleton header={PRODUCTS_HEADER} hasImage="multiple" />;
}
