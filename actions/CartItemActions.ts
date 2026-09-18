"use server";

import { unstable_cache, updateTag } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
} from "@/components/data-table/pagination/PaginationParams";
import { getFormCartItem } from "@/lib/entity/forms";
import { CART_ITEMS_HEADER } from "@/lib/entity/headers";
import type { CartItem, ParameterType } from "@/lib/entity/types";
import { getParamValues } from "@/lib/functions/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

type FilterBy = Prisma.CartItemWhereInput;

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};

	for (const field of ["quantity", "unitPrice"] as const) {
		const from = Number(filterParams[`${field}From`]);
		const to = Number(filterParams[`${field}To`]);
		if (!Number.isNaN(from) || !Number.isNaN(to)) {
			const range: { gte?: number; lte?: number } = {};
			if (!Number.isNaN(from)) range.gte = from;
			if (!Number.isNaN(to)) range.lte = to;
			where[field] = range;
		}
	}

	for (const field of ["id", "cartId", "productId"] as const) {
		const values = getParamValues(filterParams[field]);
		if (values.length) where[field] = { in: values.map(Number) };
	}

	return where;
}

type OrderBy = Prisma.CartItemOrderByWithRelationInput;

function buildOrderClause(
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
): OrderBy {
	const sortableColumns = new Set<keyof OrderBy>(
		CART_ITEMS_HEADER.map((header) => header.name as keyof OrderBy),
	);
	if (sortableColumns.has(sortBy as keyof OrderBy))
		return { [sortBy]: order } as OrderBy;
	return { id: "asc" };
}

async function getCartItemsPage(
	filterParams: ParameterType = {},
	page: number = 1,
	pageSize: number = 10000,
	order: "asc" | "desc" = "asc",
	sortBy: string = "id",
): Promise<CartItem[]> {
	const where = buildWhereClause(filterParams);
	const orderBy = buildOrderClause(sortBy, order);
	return unstable_cache(
		async () => {
			const cartItems = await prisma.cartItem.findMany({
				where,
				skip: (page - 1) * pageSize,
				take: pageSize,
				orderBy,
				include: { cart: true, product: true },
			});
			return JSON.parse(JSON.stringify(cartItems));
		},
		[
			"cart-items-page",
			String(page),
			JSON.stringify(filterParams),
			JSON.stringify({ sortBy, order }),
			String(pageSize),
		],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["cart-items"],
		},
	)();
}

async function getCartItemCount(filterParams: ParameterType = {}) {
	const where = buildWhereClause(filterParams);
	return unstable_cache(
		() => prisma.cartItem.count({ where }),
		["cart-items-count", JSON.stringify(filterParams)],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["cart-items"],
		},
	)();
}

async function createCartItem(formData: FormData) {
	const data = getFormCartItem(formData);
	try {
		const product = await prisma.product.findUnique({
			where: { id: Number(data.productId) },
			select: { price: true },
		});
		const unitPrice = product?.price ?? 0;
		const result = await prisma.cartItem.create({
			data: {
				...data,
				unitPrice,
			} as unknown as Prisma.CartItemCreateInput,
		});
		await recalculateCartTotal(Number(data.cartId));
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function deleteCartItem(id: number) {
	try {
		const item = await prisma.cartItem.findUnique({
			where: { id },
			select: { cartId: true },
		});
		const result = await prisma.cartItem.delete({ where: { id: id } });
		if (item) await recalculateCartTotal(item.cartId);
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function deleteCartItems(ids: number[]) {
	try {
		const items = await prisma.cartItem.findMany({
			where: { id: { in: ids } },
			select: { cartId: true },
		});
		const result = await prisma.cartItem.deleteMany({
			where: { id: { in: ids } },
		});
		const cartIds = [...new Set(items.map((item) => item.cartId))];
		await Promise.all(cartIds.map((cartId) => recalculateCartTotal(cartId)));
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function updateCartItem(id: number, formData: FormData) {
	const data = getFormCartItem(formData);
	try {
		const product = await prisma.product.findUnique({
			where: { id: Number(data.productId) },
			select: { price: true },
		});
		const unitPrice = product?.price ?? 0;
		const result = await prisma.cartItem.update({
			data: {
				...data,
				unitPrice,
			} as Prisma.CartItemUpdateInput,
			where: { id },
		});
		await recalculateCartTotal(Number(data.cartId));
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function updateCartItems(ids: number[], formData: FormData) {
	const data = getFormCartItem(formData);
	try {
		const items = await prisma.cartItem.findMany({
			where: { id: { in: ids } },
			select: { cartId: true, productId: true },
		});
		const productIds = [...new Set(items.map((item) => item.productId))];
		const products = await prisma.product.findMany({
			where: { id: { in: productIds } },
			select: { id: true, price: true },
		});
		const priceMap = new Map(products.map((p) => [p.id, p.price]));
		const unitPrice = priceMap.get(Number(data.productId)) ?? 0;
		const result = await prisma.cartItem.updateMany({
			data: {
				...data,
				unitPrice,
			} as Prisma.CartItemUpdateInput,
			where: { id: { in: ids } },
		});
		const cartIds = [...new Set(items.map((item) => item.cartId))];
		await Promise.all(cartIds.map((cartId) => recalculateCartTotal(cartId)));
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function recalculateCartTotal(cartId: number) {
	const items = await prisma.cartItem.findMany({
		where: { cartId },
		select: { unitPrice: true, quantity: true },
	});
	const total = items.reduce(
		(sum, item) => sum + Number(item.unitPrice) * item.quantity,
		0,
	);
	await prisma.cart.update({
		where: { id: cartId },
		data: { totalPrice: total },
	});
	updateTag("carts");
}

export {
	createCartItem,
	deleteCartItem,
	deleteCartItems,
	getCartItemCount,
	getCartItemsPage,
	updateCartItem,
	updateCartItems,
};
