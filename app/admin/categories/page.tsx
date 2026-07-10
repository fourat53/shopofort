import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
  getCategoryCount,
  getCategoriesPage,
  type CategoryType,
} from "@/queries/CategoryQueries";
import {
  type PageProps,
  DataTableLayout,
} from "@/components/data-table/DataTableLayout";

const CATEGORIES_HEADER: string[] = ["Category ID", "Name", "Gender"] as const;

export default async function CategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const totalCount = await getCategoryCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);
  const items: CategoryType[] = await getCategoriesPage(page);

  const pageKey = params.page ?? "1";

  return (
    <DataTableLayout<CategoryType>
      pageKey={pageKey}
      header={CATEGORIES_HEADER}
      totalPages={totalPages}
      rows={items}
      basePath="/categories"
    />
  );
}
