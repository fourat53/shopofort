"use server";

import { unstable_cache, updateTag } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
} from "@/components/data-table/pagination/PaginationParams";
import { getFormCartItem } from "@/lib/entity/forms";
import { CART_ITEMS_HEADER } from "@/lib/entity/headers";
import type {
	CartItem,
	ParameterType,
	ProductColor,
	ProductSize,
} from "@/lib/entity/types";
import { getParamValues } from "@/lib/functions/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

type FilterBy = Prisma.CartItemWhereInput;

function buildWhereClause(filterParams: ParameterType): FilterBy {
	const where: FilterBy = {};

	const quantityFrom = Number(filterParams.quantityFrom);
	const quantityTo = Number(filterParams.quantityTo);

	if (!Number.isNaN(quantityFrom) || !Number.isNaN(quantityTo)) {
		where.quantity = {
			...(Number.isNaN(quantityFrom) ? {} : { gte: quantityFrom }),
			...(Number.isNaN(quantityTo) ? {} : { lte: quantityTo }),
		};
	}

	const colors = getParamValues(filterParams.color);
	if (colors.length) where.color = { in: colors as ProductColor[] };

	const sizes = getParamValues(filterParams.size);
	if (sizes.length) where.size = { in: sizes as ProductSize[] };

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

async function getOrCreateUserCart(userId: string) {
	let cart = await prisma.cart.findUnique({
		where: { userId },
	});

	if (!cart) {
		cart = await prisma.cart.create({
			data: { userId, totalPrice: 0 },
		});
	}

	return cart;
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
		const userId = String(data.userId);
		if (!userId) throw new Error("User ID is required");

		const cart = await getOrCreateUserCart(userId);

		const { userId: _userId, cartId: _cartId, ...cartItemData } = data;

		const result = await prisma.cartItem.create({
			data: {
				...cartItemData,
				cartId: cart.id,
			} as unknown as Prisma.CartItemCreateInput,
		});
		await recalculateCartTotal(cart.id);
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
		const result = await prisma.cartItem.delete({ where: { id } });
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
		const result = await prisma.cartItem.update({
			data: data as Prisma.CartItemUpdateInput,
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
			select: { cartId: true },
		});
		const result = await prisma.cartItem.updateMany({
			data: data as Prisma.CartItemUpdateInput,
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
		select: { product: true, quantity: true },
	});
	const total = items.reduce(
		(sum, item) => sum + Number(item.product.price) * item.quantity,
		0,
	);
	await prisma.cart.update({
		where: { id: cartId },
		data: { totalPrice: total },
	});
	updateTag("carts");
}

async function updateCartItemQuantity(id: number, quantity: number) {
	try {
		const item = await prisma.cartItem.findUnique({
			where: { id },
			select: { cartId: true },
		});
		const result = await prisma.cartItem.update({
			where: { id },
			data: { quantity },
		});
		if (item) await recalculateCartTotal(item.cartId);
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export {
	createCartItem,
	deleteCartItem,
	deleteCartItems,
	getCartItemCount,
	getCartItemsPage,
	updateCartItem,
	updateCartItemQuantity,
	updateCartItems,
};
