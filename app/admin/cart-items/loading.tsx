import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";

export const CART_ITEMS_HEADER: string[] = [
	"CartItem ID",
	"Unit Price",
	"Quantity",
	"Total Price",
	"Cart ID",
	"Product ID",
] as const;

export default function Loading() {
	return <DataTableSkeleton header={CART_ITEMS_HEADER} />;
}
