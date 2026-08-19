const PAGE_SIZE = 25;
const IMAGE_PAGE_SIZE = 12;
const CACHE_SECONDS = 1;
const FILTER_CACHE_SECONDS = 1;

interface PageProps {
	searchParams: Promise<{
		page?: string;
		sortBy?: string;
		order?: "asc" | "desc";
	}>;
}

const SORT_ORDERS = ["asc", "desc"] as const;

type SortOrder = (typeof SORT_ORDERS)[number];

function parseSortOrder(value: string | null | undefined): SortOrder {
	return value === "desc" ? "desc" : "asc";
}

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
	page: string | string[] | undefined,
	totalCount: number,
	hasImage: boolean = false,
) {
	const pageSize = hasImage ? IMAGE_PAGE_SIZE : PAGE_SIZE;

	const pageParam = Array.isArray(page) ? page[0] : page;
	const parsedPage = Number.parseInt(pageParam ?? "1", 10);
	const requestedPage = Number.isNaN(parsedPage) ? 1 : parsedPage;
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
	const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
	const skip = (currentPage - 1) * pageSize;

	return {
		page: currentPage,
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
	const path = `/admin/${basePath}`;
	const newParams = new URLSearchParams(searchParams?.toString());

	newParams.set("page", page.toString());

	const qs = newParams.toString();
	return qs ? `${path}?${qs}` : path;
}

function sortHref(
	basePath: string,
	searchParams: URLSearchParams,
	field: string,
) {
	const path = `/admin/${basePath}`;
	const newParams = new URLSearchParams(searchParams.toString());

	const sortBy = newParams.get("sortBy");
	const order = parseSortOrder(newParams.get("order"));

	if (sortBy === field) {
		if (field === "id") {
			newParams.set("order", order === "asc" ? "desc" : "asc");
		} else if (order === "asc") {
			newParams.set("order", "desc");
		} else {
			newParams.set("sortBy", "id");
			newParams.set("order", "asc");
		}
	} else {
		newParams.set("sortBy", field);
		newParams.set("order", "asc");
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
	type PageProps,
	pageHref,
	parsePage,
	parseSortOrder,
	type SortOrder,
	sortHref,
};
