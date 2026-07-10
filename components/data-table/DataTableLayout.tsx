import DataTablePagination from "@/components/data-table/DataTablePagination";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import DataTable from "@/components/data-table/DataTable";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

interface DataTableLayoutProps<T> {
  pageKey: string;
  header: string[];
  totalPages: number;
  rows: T[];
  basePath: string;
}

async function DataTableLayout<
  T extends { id: number } & Record<string, unknown>,
>({ pageKey, header, totalPages, rows, basePath }: DataTableLayoutProps<T>) {
  return (
    <Suspense key={pageKey} fallback={<DataTableSkeleton header={header} />}>
      <DataTable<T> header={header} rows={rows} />
      {totalPages > 1 && (
        <DataTablePagination basePath={basePath} totalPages={totalPages} />
      )}
    </Suspense>
  );
}

export { type PageProps, DataTableLayout };
