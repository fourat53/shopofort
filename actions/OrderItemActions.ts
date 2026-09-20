"use server";

import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
} from "@/components/data-table/pagination/PaginationParams";
import { getFormOrderItem } from "@/lib/entity/forms";
import { ORDER_ITEMS_HEADER } from "@/lib/entity/headers";
import type {
	OrderItem,
	ParameterType,
	ProductColor,
	ProductSize,
} from "@/lib/entity/types";
import { getParamValues } from "@/lib/functions/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

type FilterBy = Prisma.OrderItemWhereInput;

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

	for (const field of ["id", "orderId", "productId"] as const) {
		const values = getParamValues(filterParams[field]);
		if (values.length) where[field] = { in: values.map(Number) };
	}

	return where;
}

type OrderBy = Prisma.OrderItemOrderByWithRelationInput;

function buildOrderClause(
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
): OrderBy {
	const sortableColumns = new Set<keyof OrderBy>(
		ORDER_ITEMS_HEADER.map((header) => header.name as keyof OrderBy),
	);
	if (sortableColumns.has(sortBy as keyof OrderBy))
		return { [sortBy]: order } as OrderBy;
	return { id: "asc" };
}

async function getOrderItemsPage(
	filterParams: ParameterType = {},
	page: number = 1,
	pageSize: number = 10000,
	order: "asc" | "desc" = "asc",
	sortBy: string = "id",
): Promise<OrderItem[]> {
	const where = buildWhereClause(filterParams);
	const orderBy = buildOrderClause(sortBy, order);
	return unstable_cache(
		async () => {
			const orderItems = await prisma.orderItem.findMany({
				where,
				skip: (page - 1) * pageSize,
				take: pageSize,
				orderBy,
				include: { order: true, product: true },
			});
			return JSON.parse(JSON.stringify(orderItems));
		},
		[
			"order-items-page",
			String(page),
			JSON.stringify(filterParams),
			JSON.stringify({ sortBy, order }),
			String(pageSize),
		],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["order-items"],
		},
	)();
}

async function getOrderItemCount(filterParams: ParameterType = {}) {
	const where = buildWhereClause(filterParams);
	return unstable_cache(
		() => prisma.orderItem.count({ where }),
		["order-items-count", JSON.stringify(filterParams)],
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["order-items"],
		},
	)();
}

async function createOrderItem(formData: FormData) {
	const data = getFormOrderItem(formData);
	try {
		const result = await prisma.orderItem.create({
			data: data as Prisma.OrderItemCreateInput,
		});
		await recalculateOrderTotal(Number(data.orderId));
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function deleteOrderItem(id: number) {
	try {
		const item = await prisma.orderItem.findUnique({
			where: { id },
			select: { orderId: true },
		});
		const result = await prisma.orderItem.delete({ where: { id } });
		if (item) await recalculateOrderTotal(item.orderId);
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function deleteOrderItems(ids: number[]) {
	try {
		const items = await prisma.orderItem.findMany({
			where: { id: { in: ids } },
			select: { orderId: true },
		});
		const result = await prisma.orderItem.deleteMany({
			where: { id: { in: ids } },
		});
		const orderIds = [...new Set(items.map((item) => item.orderId))];
		await Promise.all(
			orderIds.map((orderId) => recalculateOrderTotal(orderId)),
		);
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function updateOrderItem(id: number, formData: FormData) {
	const data = getFormOrderItem(formData);
	try {
		const result = await prisma.orderItem.update({
			data: data as Prisma.OrderItemUpdateInput,
			where: { id },
		});
		await recalculateOrderTotal(Number(data.orderId));
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function updateOrderItems(ids: number[], formData: FormData) {
	const data = getFormOrderItem(formData);
	try {
		const items = await prisma.orderItem.findMany({
			where: { id: { in: ids } },
			select: { orderId: true },
		});
		const result = await prisma.orderItem.updateMany({
			data: data as Prisma.OrderItemUpdateInput,
			where: { id: { in: ids } },
		});
		const orderIds = [...new Set(items.map((item) => item.orderId))];
		await Promise.all(
			orderIds.map((orderId) => recalculateOrderTotal(orderId)),
		);
		return JSON.parse(JSON.stringify(result));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

async function recalculateOrderTotal(orderId: number) {
	const items = await prisma.orderItem.findMany({
		where: { orderId },
		select: { product: { select: { price: true } }, quantity: true },
	});
	const total = items.reduce(
		(sum, item) => sum + Number(item.product.price) * item.quantity,
		0,
	);
	await prisma.order.update({
		where: { id: orderId },
		data: { totalPrice: total },
	});
}

export {
	createOrderItem,
	deleteOrderItem,
	deleteOrderItems,
	getOrderItemCount,
	getOrderItemsPage,
	updateOrderItem,
	updateOrderItems,
};
