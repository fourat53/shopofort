import { IMAGE_PAGE_SIZE } from "@/components/data-table/PaginationParams";
import { prisma, CACHE_REVALIDATE_SECONDS } from "@/lib/prisma";
import type { Product } from "@/lib/generated/prisma/client";
import { unstable_cache } from "next/cache";

const PRODUCTS_HEADER: string[] = [
  "Product ID",
  "Name",
  "Brand",
  "Price ($)",
  "Inventory",
  "Description",
  "Category ID",
  "Images",
] as const;

const getProductCount = unstable_cache(
  async () => prisma.product.count(),
  ["products-count"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["products"] },
);

function getProductsPage(page: number) {
  return unstable_cache(
    async () =>
      prisma.product.findMany({
        skip: (page - 1) * IMAGE_PAGE_SIZE,
        take: IMAGE_PAGE_SIZE,
        orderBy: { id: "asc" },
      }),
    ["products-page", String(page)],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["products"] },
  )();
}

type ProductType = Product;

export { PRODUCTS_HEADER, type ProductType, getProductCount, getProductsPage };
