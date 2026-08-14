import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";

export const CARTS_HEADER: string[] = [
	"Cart ID",
	"Total Amount",
	"User ID",
] as const;

export default function Loading() {
	return <DataTableSkeleton header={CARTS_HEADER} />;
}
