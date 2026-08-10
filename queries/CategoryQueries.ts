import { unstable_cache } from "next/cache";
import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import type { Category, Gender, Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const FILTERED_CACHE_SECONDS = 10;

function buildWhereClause(searchParams: Record<string, string | string[] | undefined>): Prisma.CategoryWhereInput {
	const where: Prisma.CategoryWhereInput = {};
	if (searchParams.id && !Number.isNaN(Number(searchParams.id))) where.id = Number(searchParams.id);
	if (searchParams.name)
		where.name = { contains: String(searchParams.name), mode: "insensitive" };
	if (searchParams.gender) where.gender = String(searchParams.gender) as Gender;
	return where;
}

function getCategoryCount(searchParams: Record<string, string | string[] | undefined> = {}) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => prisma.category.count({ where }),
		["categories-count", JSON.stringify(searchParams)],
		{ revalidate: Object.keys(searchParams).length ? FILTERED_CACHE_SECONDS : 3600, tags: ["categories"] },
	)();
}

function getCategoriesPage(page: number, searchParams: Record<string, string | string[] | undefined> = {}) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () =>
			prisma.category.findMany({
				where,
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
				orderBy: { id: "asc" },
			}),
		["categories-page", String(page), JSON.stringify(searchParams)],
		{ revalidate: Object.keys(searchParams).length ? FILTERED_CACHE_SECONDS : 3600, tags: ["categories"] },
	)();
}

type CategoryType = Category;

export { type CategoryType, getCategoriesPage, getCategoryCount };
