import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import { CATEGORIES_HEADER } from "@/lib/entity/entity-header";
import type { CategoryName, Gender, ParameterType } from "@/lib/entity/types";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

type FilterBy = Prisma.CategoryWhereInput;

function getParamValues(param: ParameterType[string]): string[] {
	if (!param) return [];
	return Array.isArray(param) ? param : [param];
}

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};

	const idFrom = Number(filterParams.idFrom);
	const idTo = Number(filterParams.idTo);
	if (!Number.isNaN(idFrom) || !Number.isNaN(idTo)) {
		where.id = {};
		if (!Number.isNaN(idFrom)) where.id.gte = idFrom;
		if (!Number.isNaN(idTo)) where.id.lte = idTo;
	}

	const names = getParamValues(filterParams.name);
	if (names.length) where.name = { in: names as CategoryName[] };

	const genders = getParamValues(filterParams.gender);
	if (genders.length) where.gender = { in: genders as Gender[] };

	return where;
}

type OrderBy = Prisma.CategoryOrderByWithRelationInput;

function buildOrderClause(
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
): OrderBy {
	const sortableColumns = new Set<keyof OrderBy>(
		CATEGORIES_HEADER.map((header) => header.name as keyof OrderBy),
	);
	if (sortableColumns.has(sortBy as keyof OrderBy))
		return { [sortBy]: order } as OrderBy;
	return { id: "asc" };
}

function getCategoriesPage(
	page: number,
	filterParams: ParameterType = {},
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
) {
	const where = buildWhereClause(filterParams);
	const orderBy = buildOrderClause(sortBy, order);
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
			JSON.stringify(filterParams),
			JSON.stringify({ sortBy, order }),
		],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["categories"],
		},
	)();
}

function getCategoryCount(filterParams: ParameterType = {}) {
	const where = buildWhereClause(filterParams);
	return unstable_cache(
		async () => prisma.category.count({ where }),
		["categories-count", JSON.stringify(filterParams)],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["categories"],
		},
	)();
}

export { getCategoriesPage, getCategoryCount };
