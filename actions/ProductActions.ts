import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	IMAGE_PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function buildWhereClause(
	searchParams: Record<string, string | string[] | undefined>,
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

function getProductCount(
	searchParams: Record<string, string | string[] | undefined> = {},
) {
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

function getProductsPage(
	page: number,
	searchParams: Record<string, string | string[] | undefined> = {},
) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => {
			const products = await prisma.product.findMany({
				where,
				skip: (page - 1) * IMAGE_PAGE_SIZE,
				take: IMAGE_PAGE_SIZE,
				orderBy: { id: "asc" },
			});
			return products.map(({ id, name, price, ...rest }) => ({
				id,
				name,
				price: Number(price),
				...rest,
			}));
		},
		["products-page", String(page), JSON.stringify(searchParams)],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["products"],
		},
	)();
}

export { getProductCount, getProductsPage };
