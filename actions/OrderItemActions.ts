"use server";
import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

async function createOrderItem(formData: FormData) {
	const quantity = Number(formData.get("quantity"));
	const price = Number(formData.get("price"));
	const orderId = Number(formData.get("orderId"));
	const productId = Number(formData.get("productId"));

	await prisma.orderItem.create({
		data: { quantity, price, orderId, productId },
	});

	updateTag("order-items");
}

export { createOrderItem };
