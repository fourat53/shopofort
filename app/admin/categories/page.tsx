import { getPaginationParams } from "@/components/data-table/PaginationParams";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import DataTable from "@/components/data-table/DataTable";
import { Suspense } from "react";
import {
  getCategoryCount,
  getCategoriesPage,
  type CategoryType,
} from "@/queries/CategoryQueries";

const HEADER = ["Category ID", "Name", "Gender"];

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const totalCount = await getCategoryCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);
  const items: CategoryType[] = await getCategoriesPage(page);

  const pageKey = params.page ?? "1";
  return (
    <Suspense
      key={pageKey}
      fallback={<DataTableSkeleton header={HEADER} />}
    >
      <DataTable<CategoryType> header={HEADER} rows={items} />
      {totalPages > 1 && (
        <DataTablePagination basePath={"/categories"} totalPages={totalPages} />
      )}
    </Suspense>
  );
}
