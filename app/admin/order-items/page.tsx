import { getPaginationParams } from "@/components/data-table/PaginationParams";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import DataTable from "@/components/data-table/DataTable";
import { Suspense } from "react";
import {
  getOrderItemCount,
  getOrderItemsPage,
  type OrderItemType,
} from "@/queries/OrderItemQueries";

const HEADER = ["OrderItem ID", "Quantity", "Price", "Order ID", "Product ID"];

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function OrderItemsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const totalCount = await getOrderItemCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);
  const items: OrderItemType[] = await getOrderItemsPage(page);

  const pageKey = params.page ?? "1";
  return (
    <Suspense
      key={pageKey}
      fallback={<DataTableSkeleton header={HEADER} />}
    >
      <DataTable<OrderItemType> header={HEADER} rows={items} />
      {totalPages > 1 && (
        <DataTablePagination basePath={"/order-items"} totalPages={totalPages} />
      )}
    </Suspense>
  );
}
