import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { CART_ITEMS_HEADER } from "@/queries/CartItemQueries";

export default function loading() {
  return <DataTableSkeleton header={CART_ITEMS_HEADER} />;
}
