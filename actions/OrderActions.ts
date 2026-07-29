"use server";

import { updateTag } from "next/cache";
import type { OrderStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

async function createOrder(formData: FormData) {
	const orderDate = new Date(formData.get("orderDate") as string);
	const totalAmount = Number(formData.get("totalAmount"));
	const orderStatus = (formData.get("orderStatus") as OrderStatus) || "PENDING";
	const userId = Number(formData.get("userId"));

	await prisma.order.create({
		data: {
			orderDate,
			totalAmount,
			orderStatus,
			userId,
		},
	});

	updateTag("orders");
}

async function getOrdersOptions() {
	const orders = await prisma.order.findMany({
		select: { id: true, userId: true },
		orderBy: { id: "asc" },
	});
	return orders.map((o) => ({
		value: String(o.id),
		label: `Order ${o.id} (User ${o.userId})`,
	}));
}

export { createOrder, getOrdersOptions };
