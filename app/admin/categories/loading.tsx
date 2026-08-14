import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";

export const CATEGORIES_HEADER: string[] = [
	"Category ID",
	"Name",
	"Gender",
] as const;

export default function Loading() {
	return <DataTableSkeleton header={CATEGORIES_HEADER} />;
}
