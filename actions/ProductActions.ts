"use server";

import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
} from "@/components/data-table/pagination/PaginationParams";
import { getFormProduct } from "@/lib/entity/forms";
import { PRODUCTS_HEADER } from "@/lib/entity/headers";
import type {
	ParameterType,
	Product,
	ProductColor,
	ProductSize,
} from "@/lib/entity/types";
import { getParamValues } from "@/lib/functions/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

type FilterBy = Prisma.ProductWhereInput;

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};

	const ids = getParamValues(filterParams.id);
	if (ids.length) where.id = { in: ids.map(Number) };

	const colors = getParamValues(filterParams.colors);
	if (colors.length) where.colors = { hasEvery: colors as ProductColor[] };

	const sizes = getParamValues(filterParams.sizes);
	if (sizes.length) where.sizes = { hasEvery: sizes as ProductSize[] };

	for (const field of ["price", "inventory", "rating", "votes"] as const) {
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

async function getProductsPage(
	filterParams: ParameterType = {},
	page: number = 1,
	pageSize: number = 10000,
	order: "asc" | "desc" = "asc",
	sortBy: string = "id",
): Promise<Product[]> {
	const where = buildWhereClause(filterParams);
	const orderBy = buildOrderClause(sortBy, order);
	return unstable_cache(
		async () => {
			const products = await prisma.product.findMany({
				where,
				skip: (page - 1) * pageSize,
				take: pageSize,
				orderBy,
				include: { cartItems: true, orderItems: true, category: true },
			});
			return JSON.parse(JSON.stringify(products));
		},
		[
			"products-page",
			String(page),
			JSON.stringify(filterParams),
			JSON.stringify({ sortBy, order }),
			String(pageSize),
		],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["products"],
		},
	)();
}

async function getProductCount(filterParams: ParameterType = {}) {
	const where = buildWhereClause(filterParams);
	return unstable_cache(
		() => prisma.product.count({ where }),
		["products-count", JSON.stringify(filterParams)],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["products"],
		},
	)();
}

async function updateProductRating(id: number, rating: number) {
	try {
		const product = await prisma.product.findUnique({
			where: { id },
			select: { rating: true, votes: true },
		});

		let newRating: number;
		let newVotes: number;

		if (product?.rating && product?.votes) {
			newVotes = product.votes + 1;
			newRating = (Number(product.rating) * product.votes + rating) / newVotes;
		} else {
			newVotes = 1;
			newRating = rating;
		}

		await prisma.product.update({
			where: { id },
			data: { rating: newRating, votes: newVotes },
		});
	} catch (error) {
		console.error(error);
	}
}

async function createProduct(formData: FormData) {
	const data = getFormProduct(formData);
	try {
		const result = await prisma.product.create({
			data: data as unknown as Prisma.ProductCreateInput,
		});
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function deleteProduct(id: number) {
	try {
		const result = await prisma.product.delete({ where: { id: id } });
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function deleteProducts(ids: number[]) {
	try {
		const result = await prisma.product.deleteMany({
			where: { id: { in: ids } },
		});
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function updateProduct(id: number, formData: FormData) {
	const data = getFormProduct(formData);
	try {
		const result = await prisma.product.update({
			data: data as unknown as Prisma.ProductUpdateInput,
			where: { id },
		});
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function updateProducts(ids: number[], formData: FormData) {
	const data = getFormProduct(formData);
	try {
		const result = await prisma.product.updateMany({
			data: data as unknown as Prisma.ProductUpdateInput,
			where: { id: { in: ids } },
		});
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export {
	createProduct,
	deleteProduct,
	deleteProducts,
	getProductCount,
	getProductsPage,
	updateProduct,
	updateProductRating,
	updateProducts,
};
