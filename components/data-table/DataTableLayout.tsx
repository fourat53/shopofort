import DataTablePagination from "@/components/data-table/DataTablePagination";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import DataTable from "@/components/data-table/DataTable";
import { Suspense } from "react";
import { PAGE_SIZE } from "./PaginationParams";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

interface DataTableLayoutProps<T> {
  totalPages: number;
  header: string[];
  basePath: string;
  pageKey: string;
  rows: T[];
  hasImages?: boolean;
}

async function DataTableLayout<
  T extends { id: number } & Record<string, unknown>,
>({
  totalPages,
  header,
  basePath,
  pageKey,
  rows,
  hasImages = false,
}: DataTableLayoutProps<T>) {
  return (
    <Suspense
      key={pageKey}
      fallback={<DataTableSkeleton header={header} hasImages={hasImages} />}
    >
      <DataTable<T> header={header} rows={rows} />
      {totalPages > 1 && (
        <DataTablePagination basePath={basePath} totalPages={totalPages} />
      )}
    </Suspense>
  );
}

export { type PageProps, DataTableLayout };
