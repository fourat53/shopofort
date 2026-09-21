"use server";

import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
} from "@/components/data-table/pagination/PaginationParams";
import { getFormCart } from "@/lib/entity/forms";
import { CARTS_HEADER } from "@/lib/entity/headers";
import type { Cart, ParameterType } from "@/lib/entity/types";
import { getParamValues } from "@/lib/functions/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/browser";

type FilterBy = Prisma.CartWhereInput;

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};

	const ids = getParamValues(filterParams.id);
	if (ids.length) where.id = { in: ids.map(Number) };

	const from = Number(filterParams.totalAmountFrom);
	const to = Number(filterParams.totalAmountTo);
	if (!Number.isNaN(from) || !Number.isNaN(to)) {
		const range: { gte?: number; lte?: number } = {};
		if (!Number.isNaN(from)) range.gte = from;
		if (!Number.isNaN(to)) range.lte = to;
		where.totalPrice = range;
	}

	const userIds = getParamValues(filterParams.userId);
	if (userIds.length) where.userId = { in: userIds };

	return where;
}

type OrderBy = Prisma.CartOrderByWithRelationInput;

function buildOrderClause(
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
): OrderBy {
	const sortableColumns = new Set<keyof OrderBy>(
		CARTS_HEADER.map((header) => header.name as keyof OrderBy),
	);
	if (sortableColumns.has(sortBy as keyof OrderBy))
		return { [sortBy]: order } as OrderBy;
	return { id: "asc" };
}

async function getCartsPage(
	filterParams: ParameterType = {},
	page: number = 1,
	pageSize: number = 10000,
	order: "asc" | "desc" = "asc",
	sortBy: string = "id",
): Promise<Cart[]> {
	const where = buildWhereClause(filterParams);
	const orderBy = buildOrderClause(sortBy, order);
	return unstable_cache(
		async () => {
			const carts = await prisma.cart.findMany({
				where,
				skip: (page - 1) * pageSize,
				take: pageSize,
				orderBy,
				include: {
					cartItems: {
						select: {
							id: true,
							quantity: true,
							color: true,
							size: true,
							cartId: true,
							productId: true,
							cart: true,
							product: true,
						},
					},
				},
			});
			return JSON.parse(JSON.stringify(carts));
		},
		[
			"carts-page",
			String(page),
			JSON.stringify(filterParams),
			JSON.stringify({ sortBy, order }),
			String(pageSize),
		],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["carts"],
		},
	)();
}

async function getCartCount(filterParams: ParameterType = {}) {
	const where = buildWhereClause(filterParams);
	return unstable_cache(
		() => prisma.cart.count({ where }),
		["carts-count", JSON.stringify(filterParams)],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["carts"],
		},
	)();
}

async function createCart(formData: FormData) {
	const data = getFormCart(formData);
	try {
		const result = await prisma.cart.create({
			data: data as Prisma.CartCreateInput,
		});
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function deleteCart(id: number) {
	try {
		const result = await prisma.cart.delete({ where: { id } });
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function deleteCarts(ids: number[]) {
	try {
		const result = await prisma.cart.deleteMany({ where: { id: { in: ids } } });
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function updateCart(id: number, formData: FormData) {
	const data = getFormCart(formData);
	try {
		const result = await prisma.cart.update({
			data: data as Prisma.CartUpdateInput,
			where: { id },
		});
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function updateCarts(ids: number[], formData: FormData) {
	const data = getFormCart(formData);
	try {
		const result = await prisma.cart.updateMany({
			data: data as Prisma.CartUpdateInput,
			where: { id: { in: ids } },
		});
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function getOrCreateUserCart(userId: string) {
	let cart = await prisma.cart.findUnique({
		where: { userId },
		include: {
			cartItems: {
				include: { product: true },
			},
		},
	});

	if (!cart) {
		cart = await prisma.cart.create({
			data: { userId, totalPrice: 0 },
			include: {
				cartItems: {
					include: { product: true },
				},
			},
		});
	}

	return JSON.parse(JSON.stringify(cart));
}

export {
	createCart,
	deleteCart,
	deleteCarts,
	getCartCount,
	getCartsPage,
	getOrCreateUserCart,
	updateCart,
	updateCarts,
};
