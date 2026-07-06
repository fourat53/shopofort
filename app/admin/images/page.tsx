import { getPaginationParams } from "@/components/data-table/PaginationParams";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import DataTable from "@/components/data-table/DataTable";
import { Suspense } from "react";
import {
  getImageCount,
  getImagesPage,
  type ImageType,
} from "@/queries/ImageQueries";

const HEADER = ["Image ID", "File Name", "File Type", "Product ID"];

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ImagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const totalCount = await getImageCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);
  const items: ImageType[] = await getImagesPage(page);

  const pageKey = params.page ?? "1";
  return (
    <Suspense
      key={pageKey}
      fallback={<DataTableSkeleton header={HEADER} />}
    >
      <DataTable<ImageType> header={HEADER} rows={items} />
      {totalPages > 1 && (
        <DataTablePagination basePath={"/images"} totalPages={totalPages} />
      )}
    </Suspense>
  );
}
