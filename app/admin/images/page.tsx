import { getImagePaginationParams } from "@/components/data-table/PaginationParams";
import {
  getImageCount,
  getImagesPage,
  type ImageType,
} from "@/queries/ImageQueries";
import {
  type PageProps,
  DataTableLayout,
} from "@/components/data-table/DataTableLayout";

const IMAGES_HEADER: string[] = [
  "Image ID",
  "Preview",
  "File Name",
  "File Type",
  "Product ID",
] as const;

export default async function ImagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const totalCount = await getImageCount();
  const { page, totalPages } = getImagePaginationParams(params, totalCount);
  const items: ImageType[] = await getImagesPage(page);

  const pageKey = params.page ?? "1";

  return (
    <DataTableLayout<ImageType>
      pageKey={pageKey}
      header={IMAGES_HEADER}
      totalPages={totalPages}
      rows={items}
      basePath="/images"
    />
  );
}
