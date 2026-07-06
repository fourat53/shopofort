import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
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
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { id: "asc" },
        omit: { image: true, downloadUrl: true },
      }),
    ["images-page", String(page)],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["images"] },
  )();
}

type ImageType = Omit<Image, "image" | "downloadUrl">;
export { type ImageType, getImageCount, getImagesPage };
