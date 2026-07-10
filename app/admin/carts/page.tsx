import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
  getCartCount,
  getCartsPage,
  type CartType,
} from "@/queries/CartQueries";
import {
  type PageProps,
  DataTableLayout,
} from "@/components/data-table/DataTableLayout";

const CARTS_HEADER: string[] = ["Cart ID", "Total Amount", "User ID"] as const;

export default async function CartsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const totalCount = await getCartCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);

  const carts: CartType[] = await getCartsPage(page);
  const pageKey = params.page ?? "1";

  return (
    <DataTableLayout<CartType>
      pageKey={pageKey}
      header={CARTS_HEADER}
      totalPages={totalPages}
      rows={carts}
      basePath="/carts"
    />
  );
}
