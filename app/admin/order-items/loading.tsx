import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { ORDER_ITEMS_HEADER } from "@/queries/OrderItemQueries";

export default function loading() {
  return <DataTableSkeleton header={ORDER_ITEMS_HEADER} />;
}
