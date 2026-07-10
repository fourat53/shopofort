import { IMAGE_PAGE_SIZE } from "@/components/data-table/PaginationParams";
import { prisma, CACHE_REVALIDATE_SECONDS } from "@/lib/prisma";
import type { Image } from "@/lib/generated/prisma/client";
import { unstable_cache } from "next/cache";

const getImageCount = unstable_cache(
  async () => prisma.image.count(),
  ["images-count"],
  { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["images"] },
);

function getImagesPage(page: number) {
  return unstable_cache(
    async () =>
      prisma.image.findMany({
        skip: (page - 1) * IMAGE_PAGE_SIZE,
        take: IMAGE_PAGE_SIZE,
        orderBy: { id: "asc" },
        select: {
          id: true,
          downloadUrl: true,
          fileName: true,
          fileType: true,
          productId: true,
        },
      }),
    ["images-page", String(page)],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["images"] },
  )();
}

type ImageType = Pick<
  Image,
  "id" | "downloadUrl" | "fileName" | "fileType" | "productId"
>;
export { type ImageType, getImageCount, getImagesPage };
