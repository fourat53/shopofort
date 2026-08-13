"use server";

import { updateTag } from "next/cache";
import type { OrderStatus } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function getFormOrder(formData: FormData) {
	const orderDate = new Date(formData.get("orderDate") as string);
	const totalAmount = Number(formData.get("totalAmount"));
	const orderStatus = formData.get("orderStatus") as OrderStatus;
	const userId = String(formData.get("userId"));
	return { orderDate, totalAmount, orderStatus, userId };
}

async function createOrder(formData: FormData) {
	await prisma.order.create({
		data: getFormOrder(formData),
	});
	updateTag("orders");
}

async function updateOrder(id: number, formData: FormData) {
	await prisma.order.update({
		where: { id },
		data: getFormOrder(formData),
	});
	updateTag("orders");
}

export { createOrder, updateOrder };
