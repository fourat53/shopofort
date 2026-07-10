import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
  getOrderCount,
  getOrdersPage,
  type OrderType,
} from "@/queries/OrderQueries";
import {
  type PageProps,
  DataTableLayout,
} from "@/components/data-table/DataTableLayout";

const ORDERS_HEADER: string[] = [
  "Order ID",
  "Order Date",
  "Total Amount",
  "Order Status",
  "User ID",
] as const;

export default async function OrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const totalCount = await getOrderCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);

  const orders: OrderType[] = await getOrdersPage(page);
  const pageKey = params.page ?? "1";

  return (
    <DataTableLayout<OrderType>
      pageKey={pageKey}
      header={ORDERS_HEADER}
      totalPages={totalPages}
      rows={orders}
      basePath="/orders"
    />
  );
}
