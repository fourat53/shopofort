import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import { CATEGORIES_HEADER } from "@/lib/entity/entity-header";
import type { CategoryName, Gender, ParameterType } from "@/lib/entity/types";
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function buildWhereClause(
	searchParams: ParameterType,
): Prisma.CategoryWhereInput {
	const where: Prisma.CategoryWhereInput = {};
	if (searchParams.id && !Number.isNaN(Number(searchParams.id)))
		where.id = Number(searchParams.id);
	if (searchParams.name) where.name = String(searchParams.name) as CategoryName;
	if (searchParams.gender) where.gender = String(searchParams.gender) as Gender;
	return where;
}

function buildOrderClause(
	orderParams: ParameterType,
): Prisma.CategoryOrderByWithRelationInput {
	const sortBy =
		typeof orderParams.sortBy === "string" ? orderParams.sortBy : undefined;
	const order = orderParams.order === "desc" ? "desc" : "asc";

	const sortableColumns = new Set<
		keyof Prisma.CategoryOrderByWithRelationInput
	>(
		CATEGORIES_HEADER.map(
			(header) => header.name as keyof Prisma.CategoryOrderByWithRelationInput,
		),
	);
	if (
		sortBy &&
		sortableColumns.has(sortBy as keyof Prisma.CategoryOrderByWithRelationInput)
	)
		return {
			[sortBy]: order,
		} as Prisma.CategoryOrderByWithRelationInput;
	return { id: "asc" };
}

function getCategoriesPage(
	page: number,
	searchParams: ParameterType = {},
	orderParams: ParameterType = {},
) {
	const where = buildWhereClause(searchParams);
	const orderBy = buildOrderClause(orderParams);
	return unstable_cache(
		async () =>
			prisma.category.findMany({
				where,
				skip: (page - 1) * PAGE_SIZE,
				take: PAGE_SIZE,
				orderBy,
			}),
		[
			"categories-page",
			String(page),
			JSON.stringify(searchParams),
			JSON.stringify(orderParams),
		],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["categories"],
		},
	)();
}

function getCategoryCount(searchParams: ParameterType = {}) {
	const where = buildWhereClause(searchParams);
	return unstable_cache(
		async () => prisma.category.count({ where }),
		["categories-count", JSON.stringify(searchParams)],
		{
			revalidate: Object.keys(searchParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["categories"],
		},
	)();
}

export { getCategoriesPage, getCategoryCount };
