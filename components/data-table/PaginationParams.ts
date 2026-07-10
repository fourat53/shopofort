const PAGE_SIZE = 20;
const IMAGE_PAGE_SIZE = 9;

type SearchParams = {
  page?: string;
};

function parsePage(
  value: string | null | undefined,
  totalPages?: number,
): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  const page = Number.isNaN(parsed) ? 1 : parsed;

  if (totalPages !== undefined) {
    return Math.min(Math.max(1, page), totalPages);
  }

  return Math.max(1, page);
}

function getPaginationParams(searchParams: SearchParams, totalCount: number) {
  const parsedPage = Number.parseInt(searchParams.page ?? "1", 10);
  const requestedPage = Number.isNaN(parsedPage) ? 1 : parsedPage;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const skip = (page - 1) * PAGE_SIZE;

  return {
    page,
    skip,
    take: PAGE_SIZE,
    totalPages,
    totalCount,
  };
}

function getImagePaginationParams(
  searchParams: SearchParams,
  totalCount: number,
) {
  const parsedPage = Number.parseInt(searchParams.page ?? "1", 10);
  const requestedPage = Number.isNaN(parsedPage) ? 1 : parsedPage;
  const totalPages = Math.max(1, Math.ceil(totalCount / IMAGE_PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const skip = (page - 1) * IMAGE_PAGE_SIZE;

  return {
    page,
    skip,
    take: IMAGE_PAGE_SIZE,
    totalPages,
    totalCount,
  };
}

function pageHref(basePath: string, page: number) {
  const path = `/admin${basePath}`;
  return page === 1 ? path : `${path}?page=${page}`;
}

type VisiblePageItem =
  | { type: "page"; page: number }
  | { type: "ellipsis"; key: "leading" | "trailing" };

function getVisiblePages(
  currentPage: number,
  totalPages: number,
): VisiblePageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => ({
      type: "page" as const,
      page: index + 1,
    }));
  }

  const pages: VisiblePageItem[] = [{ type: "page", page: 1 }];

  if (currentPage > 3) {
    pages.push({ type: "ellipsis", key: "leading" });
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page++) {
    pages.push({ type: "page", page });
  }

  if (currentPage < totalPages - 2) {
    pages.push({ type: "ellipsis", key: "trailing" });
  }

  pages.push({ type: "page", page: totalPages });

  return pages;
}

export {
  PAGE_SIZE,
  IMAGE_PAGE_SIZE,
  parsePage,
  getPaginationParams,
  getImagePaginationParams,
  pageHref,
  getVisiblePages,
};
