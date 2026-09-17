import { updateTag } from "next/cache";
import { EntityType, type ParameterType } from "@/lib/entity/types";
import { Prisma } from "@/prisma/generated/prisma/browser";

function getParamValues(param: ParameterType[string]): string[] {
	if (!param) return [];
	return Array.isArray(param) ? param : [param];
}

function formatOption(
	v: string | number,
	l: (string | number) | [string | number, string | number],
) {
	return { value: v.toString(), label: l };
}

function sameValue(a: unknown, b: unknown): boolean {
	if (Object.is(a, b)) return true;

	if (a instanceof Date && b instanceof Date)
		return a.getTime() === b.getTime();

	if (Array.isArray(a) && Array.isArray(b))
		return (
			a.length === b.length &&
			a.every((value, index) => sameValue(value, b[index]))
		);

	if (
		a !== null &&
		b !== null &&
		typeof a === "object" &&
		typeof b === "number" &&
		a.constructor.name === "Decimal"
	)
		return Number(a) === b;

	if (
		a !== null &&
		b !== null &&
		typeof b === "object" &&
		typeof a === "number" &&
		b.constructor.name === "Decimal"
	)
		return a === Number(b);

	return false;
}

function getChangedData(
	current: Record<string, unknown>,
	data: Record<string, unknown>,
) {
	return Object.fromEntries(
		Object.entries(data).filter(
			([key, value]) => !sameValue(current[key], value),
		),
	);
}

function getChangedDataForMany(
	currentRows: Record<string, unknown>[],
	data: Record<string, unknown>,
) {
	return Object.fromEntries(
		Object.entries(data).filter(([key, value]) =>
			currentRows.some((row) => !sameValue(row[key], value)),
		),
	);
}

function updateEntityTags(entity: EntityType) {
	updateTag(entity);
	if (entity === EntityType["cart-items"]) updateTag(EntityType.carts);
	if (entity === EntityType["order-items"]) updateTag(EntityType.orders);
}

async function updateCartTotals(
	tx: Prisma.TransactionClient,
	cartIds: number[],
) {
	"use server";

	for (const cartId of [...new Set(cartIds)]) {
		const cart = await tx.cart.findUniqueOrThrow({
			where: { id: cartId },
			select: {
				cartItems: {
					select: {
						unitPrice: true,
						quantity: true,
					},
				},
			},
		});

		const totalPrice = cart.cartItems.reduce(
			(total, item) => total.plus(item.unitPrice.mul(item.quantity)),
			new Prisma.Decimal(0),
		);

		await tx.cart.update({
			where: { id: cartId },
			data: { totalPrice },
		});
	}
}

async function updateOrderTotals(
	tx: Prisma.TransactionClient,
	orderIds: number[],
) {
	"use server";

	for (const orderId of [...new Set(orderIds)]) {
		const order = await tx.order.findUniqueOrThrow({
			where: { id: orderId },
			select: {
				orderItems: {
					select: {
						unitPrice: true,
						quantity: true,
					},
				},
			},
		});

		const totalPrice = order.orderItems.reduce(
			(total, item) => total.plus(item.unitPrice.mul(item.quantity)),
			new Prisma.Decimal(0),
		);

		await tx.order.update({
			where: { id: orderId },
			data: { totalPrice },
		});
	}
}

export {
	formatOption,
	getChangedData,
	getChangedDataForMany,
	getParamValues,
	sameValue,
	updateCartTotals,
	updateEntityTags,
	updateOrderTotals,
};
