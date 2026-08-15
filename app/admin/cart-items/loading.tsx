import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { CART_ITEMS_HEADER } from "@/lib/entity/entity-headers";

export default function Loading() {
	return <DataTableSkeleton header={CART_ITEMS_HEADER} />;
}
