import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";

export const ORDER_ITEMS_HEADER: string[] = [
	"OrderItem ID",
	"Price",
	"Quantity",
	"Order ID",
	"Product ID",
] as const;

export default function Loading() {
	return <DataTableSkeleton header={ORDER_ITEMS_HEADER} />;
}
