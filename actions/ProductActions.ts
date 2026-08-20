import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	IMAGE_PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import { PRODUCTS_HEADER } from "@/lib/entity/entity-header";
import type { ParameterType } from "@/lib/entity/types";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

type FilterBy = Prisma.ProductWhereInput;

function getParamValues(param: ParameterType[string]): string[] {
	if (!param) return [];
	return Array.isArray(param) ? param : [param];
}

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};
	if (filterParams.id) where.id = Number(filterParams.id);
	if (filterParams.name)
		where.name = { contains: String(filterParams.name), mode: "insensitive" };
	if (filterParams.brand)
		where.brand = { contains: String(filterParams.brand), mode: "insensitive" };

	const priceFrom = Number(filterParams.priceFrom);
	const priceTo = Number(filterParams.priceTo);
	if (!Number.isNaN(priceFrom) || !Number.isNaN(priceTo)) {
		where.price = {};
		if (!Number.isNaN(priceFrom)) where.price.gte = priceFrom;
		if (!Number.isNaN(priceTo)) where.price.lte = priceTo;
	}

	const inventoryFrom = Number(filterParams.inventoryFrom);
	const inventoryTo = Number(filterParams.inventoryTo);
	if (!Number.isNaN(inventoryFrom) || !Number.isNaN(inventoryTo)) {
		where.inventory = {};
		if (!Number.isNaN(inventoryFrom)) where.inventory.gte = inventoryFrom;
		if (!Number.isNaN(inventoryTo)) where.inventory.lte = inventoryTo;
	}

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
