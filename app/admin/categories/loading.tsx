import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";

export const CATEGORIES_HEADER: string[] = [
	"Category ID",
	"Name",
	"Gender",
] as const;

export default function loading() {
	return <DataTableSkeleton header={CATEGORIES_HEADER} />;
}
