import { getPaginationParams } from "@/components/data-table/PaginationParams";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import DataTable from "@/components/data-table/DataTable";
import { Suspense } from "react";
import {
  getCartItemCount,
  getCartItemsPage,
  type CartItemType,
} from "@/queries/CartItemQueries";

const HEADER = ["CartItem ID", "Quantity", "Unit Price", "Total Price", "Cart ID", "Product ID"];

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function CartItemsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const totalCount = await getCartItemCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);
  const items: CartItemType[] = await getCartItemsPage(page);

  const pageKey = params.page ?? "1";
  return (
    <Suspense
      key={pageKey}
      fallback={<DataTableSkeleton header={HEADER} />}
    >
      <DataTable<CartItemType> header={HEADER} rows={items} />
      {totalPages > 1 && (
        <DataTablePagination basePath={"/cart-items"} totalPages={totalPages} />
      )}
    </Suspense>
  );
}
