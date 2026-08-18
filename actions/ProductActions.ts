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

function buildWhereClause(
	searchParams: ParameterType,
): Prisma.ProductWhereInput {
	const where: Prisma.ProductWhereInput = {};
	if (searchParams.id) where.id = Number(searchParams.id);
	if (searchParams.name)
		where.name = { contains: String(searchParams.name), mode: "insensitive" };
	if (searchParams.brand)
		where.brand = { contains: String(searchParams.brand), mode: "insensitive" };
	if (searchParams.price) where.price = Number(searchParams.price);
	if (searchParams.inventory) where.inventory = Number(searchParams.inventory);
	if (searchParams.categoryId)
		where.categoryId = Number(searchParams.categoryId);
	return where;
}

type ProductOrderInput = Prisma.ProductOrderByWithRelationInput;

function buildOrderClause(orderParams: ParameterType): ProductOrderInput {
	const sortBy =
		typeof orderParams.sortBy === "string" ? orderParams.sortBy : undefined;
	const order = orderParams.order === "desc" ? "desc" : "asc";

	const sortableColumns = new Set<keyof ProductOrderInput>(
		PRODUCTS_HEADER.map((header) => header.name as keyof ProductOrderInput),
	);

	if (sortBy && sortableColumns.has(sortBy as keyof ProductOrderInput))
		return {
			[sortBy]: order,
		} as ProductOrderInput;
	return { id: "asc" };
}

function getProductsPage(
	page: number,
	searchParams: ParameterType = {},
	orderParams: ParameterType = {},
) {
	const where = buildWhereClause(searchParams);
	const orderBy = buildOrderClause(orderParams);
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
			JSON.stringify(searchParams),
			JSON.stringify(orderParams),
		],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["products"],
		},
	)();
}

function getProductCount(searchParams: ParameterType = {}) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => prisma.product.count({ where }),
		["products-count", JSON.stringify(searchParams)],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["products"],
		},
	)();
}

export { getProductCount, getProductsPage };
