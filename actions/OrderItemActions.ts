"use server";
import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

function getFormOrderItem(formData: FormData) {
	const quantity = Number(formData.get("quantity"));
	const price = Number(formData.get("price"));
	const orderId = Number(formData.get("orderId"));
	const productId = Number(formData.get("productId"));
	return { quantity, price, orderId, productId };
}

async function createOrderItem(formData: FormData) {
	await prisma.orderItem.create({
		data: getFormOrderItem(formData),
	});
	updateTag("order-items");
}

async function updateOrderItem(id: number, formData: FormData) {
	await prisma.orderItem.update({
		where: { id },
		data: getFormOrderItem(formData),
	});
	updateTag("order-items");
}

export { createOrderItem, updateOrderItem };
