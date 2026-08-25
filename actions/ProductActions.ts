import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	IMAGE_PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import {
	getParamValues,
	type ParameterType,
	PRODUCTS_HEADER,
} from "@/lib/entity/entity-header";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

type FilterBy = Prisma.ProductWhereInput;

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};

	const ids = getParamValues(filterParams.id);
	if (ids.length) where.id = { in: ids.map(Number) };

	for (const field of ["price", "inventory"] as const) {
		const from = Number(filterParams[`${field}From`]);
		const to = Number(filterParams[`${field}To`]);
		if (!Number.isNaN(from) || !Number.isNaN(to)) {
			const range: { gte?: number; lte?: number } = {};
			if (!Number.isNaN(from)) range.gte = from;
			if (!Number.isNaN(to)) range.lte = to;
			where[field] = range;
		}
	}

	if (filterParams.name)
		where.name = { contains: String(filterParams.name), mode: "insensitive" };
	if (filterParams.brand)
		where.brand = { contains: String(filterParams.brand), mode: "insensitive" };

	const categoryIds = getParamValues(filterParams.categoryId);
	if (categoryIds.length) where.categoryId = { in: categoryIds.map(Number) };

	return where;
}

type OrderBy = Prisma.ProductOrderByWithRelationInput;

function buildOrderClause(
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
): OrderBy {
	const sortableColumns = new Set<keyof OrderBy>(
		PRODUCTS_HEADER.map((header) => header.name as keyof OrderBy),
	);
	if (sortableColumns.has(sortBy as keyof OrderBy))
		return { [sortBy]: order } as OrderBy;
	return { id: "asc" };
}

function getProductsPage(
	page: number,
	filterParams: ParameterType = {},
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
) {
	const where = buildWhereClause(filterParams);
	const orderBy = buildOrderClause(sortBy, order);
	return unstable_cache(
		async () => {
			const products = await prisma.product.findMany({
				where,
				skip: (page - 1) * IMAGE_PAGE_SIZE,
				take: IMAGE_PAGE_SIZE,
				orderBy,
			});
			return products.map(({ id, name, price, ...rest }) => ({
				id,
				name,
				price: Number(price),
				...rest,
			}));
		},
		[
			"products-page",
			String(page),
			JSON.stringify(filterParams),
			JSON.stringify({ sortBy, order }),
		],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["products"],
		},
	)();
}

function getProductCount(filterParams: ParameterType = {}) {
	const where = buildWhereClause(filterParams);
	return unstable_cache(
		async () => prisma.product.count({ where }),
		["products-count", JSON.stringify(filterParams)],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["products"],
		},
	)();
}

export { getProductCount, getProductsPage };
