"use server";
import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

function getFormCartItem(formData: FormData) {
	const quantity = Number(formData.get("quantity"));
	const unitPrice = Number(formData.get("unitPrice"));
	const totalPrice = Number(formData.get("totalPrice"));
	const cartId = Number(formData.get("cartId"));
	const productId = Number(formData.get("productId"));
	return { quantity, unitPrice, totalPrice, cartId, productId };
}

async function createCartItem(formData: FormData) {
	await prisma.cartItem.create({
		data: getFormCartItem(formData),
	});
	updateTag("cart-items");
}

async function updateCartItem(id: number, formData: FormData) {
	await prisma.cartItem.update({
		where: { id },
		data: getFormCartItem(formData),
	});
	updateTag("cart-items");
}

export { createCartItem, updateCartItem };
