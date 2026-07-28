import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
  getCategoryCount,
  getCategoriesPage,
  type CategoryType,
  CATEGORIES_HEADER,
} from "@/queries/CategoryQueries";
import {
  type PageProps,
  DataTableLayout,
} from "@/components/data-table/DataTableLayout";

export default async function CategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const totalCount = await getCategoryCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);

  const items: CategoryType[] = await getCategoriesPage(page);

  return (
    <DataTableLayout<CategoryType>
      header={CATEGORIES_HEADER}
      totalPages={totalPages}
      rows={items}
      basePath="/categories"
    />
  );
}
