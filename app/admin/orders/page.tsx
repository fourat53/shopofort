import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
  getOrderCount,
  getOrdersPage,
  ORDERS_HEADER,
  type OrderType,
} from "@/queries/OrderQueries";
import {
  type PageProps,
  DataTableLayout,
} from "@/components/data-table/DataTableLayout";

export default async function OrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const totalCount = await getOrderCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);

  const orders: OrderType[] = await getOrdersPage(page);

  return (
    <DataTableLayout<OrderType>
      header={ORDERS_HEADER}
      totalPages={totalPages}
      rows={orders}
      basePath="/orders"
    />
  );
}
