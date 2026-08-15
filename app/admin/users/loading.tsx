import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { USERS_HEADER } from "@/lib/entity/entity-headers";

export default function Loading() {
	return <DataTableSkeleton header={USERS_HEADER} hasImage="one" />;
}
