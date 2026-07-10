import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
  getProductCount,
  getProductsPage,
  type ProductType,
} from "@/queries/ProductQueries";
import {
  type PageProps,
  DataTableLayout,
} from "@/components/data-table/DataTableLayout";

const PRODUCTS_HEADER: string[] = [
  "Product ID",
  "Name",
  "Brand",
  "Price ($)",
  "Inventory",
  "Description",
  "Category ID",
] as const;

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const totalCount = await getProductCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);

  const products: ProductType[] = await getProductsPage(page);
  const pageKey = params.page ?? "1";

  return (
    <DataTableLayout<ProductType>
      pageKey={pageKey}
      header={PRODUCTS_HEADER}
      totalPages={totalPages}
      rows={products}
      basePath="/products"
    />
  );
}
