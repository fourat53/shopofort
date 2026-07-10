import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
  getOrderItemCount,
  getOrderItemsPage,
  type OrderItemType,
} from "@/queries/OrderItemQueries";
import {
  type PageProps,
  DataTableLayout,
} from "@/components/data-table/DataTableLayout";

const ORDER_ITEMS_HEADER: string[] = [
  "OrderItem ID",
  "Quantity",
  "Price",
  "Order ID",
  "Product ID",
] as const;

export default async function OrderItemsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const totalCount = await getOrderItemCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);
  const items: OrderItemType[] = await getOrderItemsPage(page);

  const pageKey = params.page ?? "1";

  return (
    <DataTableLayout<OrderItemType>
      pageKey={pageKey}
      header={ORDER_ITEMS_HEADER}
      totalPages={totalPages}
      rows={items}
      basePath="/order-items"
    />
  );
}
