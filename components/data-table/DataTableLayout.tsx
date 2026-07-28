import DataTablePagination from "@/components/data-table/DataTablePagination";
import DataTable from "@/components/data-table/DataTable";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

interface DataTableLayoutProps<T> {
  totalPages: number;
  header: string[];
  basePath: string;
  rows: T[];
  hasImages?: boolean;
}

async function DataTableLayout<
  T extends { id: number } & Record<string, unknown>,
>({ totalPages, header, basePath, rows }: DataTableLayoutProps<T>) {
  return (
    <>
      <DataTable<T> header={header} rows={rows} />
      {totalPages > 1 && (
        <DataTablePagination basePath={basePath} totalPages={totalPages} />
      )}
    </>
  );
}

export { type PageProps, DataTableLayout };
