import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
  getCartItemCount,
  getCartItemsPage,
  type CartItemType,
} from "@/queries/CartItemQueries";
import {
  type PageProps,
  DataTableLayout,
} from "@/components/data-table/DataTableLayout";

const CART_ITEMS_HEADER: string[] = [
  "CartItem ID",
  "Quantity",
  "Unit Price",
  "Total Price",
  "Cart ID",
  "Product ID",
] as const;

export default async function CartItemsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const totalCount = await getCartItemCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);
  const items: CartItemType[] = await getCartItemsPage(page);

  const pageKey = params.page ?? "1";

  return (
    <DataTableLayout<CartItemType>
      pageKey={pageKey}
      header={CART_ITEMS_HEADER}
      totalPages={totalPages}
      rows={items}
      basePath="/cart-items"
    />
  );
}
