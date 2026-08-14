import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";

export const PRODUCTS_HEADER: string[] = [
	"Product ID",
	"Name",
	"Price ($)",
	"Brand",
	"Inventory",
	"Description",
	"Category ID",
	"Images",
] as const;

export default function Loading() {
	return <DataTableSkeleton header={PRODUCTS_HEADER} hasImage="multiple" />;
}
