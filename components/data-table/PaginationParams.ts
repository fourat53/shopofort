const PAGE_SIZE = 25;
const IMAGE_PAGE_SIZE = 12;
const CACHE_SECONDS = 3600;
const FILTER_CACHE_SECONDS = 10;

type SearchParams = {
	[key: string]: string | string[] | undefined;
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

function getPaginationParams(
	searchParams: SearchParams,
	totalCount: number,
	hasImage: boolean = false,
) {
	const pageSize = hasImage ? IMAGE_PAGE_SIZE : PAGE_SIZE;

	const pageParam = Array.isArray(searchParams.page)
		? searchParams.page[0]
		: searchParams.page;
	const parsedPage = Number.parseInt(pageParam ?? "1", 10);
	const requestedPage = Number.isNaN(parsedPage) ? 1 : parsedPage;
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
	const page = Math.min(Math.max(1, requestedPage), totalPages);
	const skip = (page - 1) * pageSize;

	return {
		page,
		skip,
		take: pageSize,
		totalPages,
		totalCount,
	};
}

function pageHref(
	basePath: string,
	page: number,
	searchParams?: URLSearchParams,
) {
	const path = `/admin${basePath}`;
	const newParams = new URLSearchParams(searchParams?.toString());

	if (page === 1) {
		newParams.delete("page");
	} else {
		newParams.set("page", page.toString());
	}

	const qs = newParams.toString();
	return qs ? `${path}?${qs}` : path;
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
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	getPaginationParams,
	getVisiblePages,
	IMAGE_PAGE_SIZE,
	PAGE_SIZE,
	pageHref,
	parsePage,
};
