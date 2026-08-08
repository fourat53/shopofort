import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";

export const ORDERS_HEADER: string[] = [
	"Order ID",
	"Order Date",
	"Total Amount",
	"Order Status",
	"User ID",
] as const;

export default function loading() {
	return <DataTableSkeleton header={ORDERS_HEADER} />;
}
