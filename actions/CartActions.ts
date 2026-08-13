"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

function getFormCart(formData: FormData) {
	const userId = String(formData.get("userId"));
	const totalAmount = Number(formData.get("totalAmount")) || 0;
	return { userId, totalAmount };
}

async function createCart(formData: FormData) {
	await prisma.cart.create({
		data: getFormCart(formData),
	});
	updateTag("carts");
}

async function updateCart(id: number, formData: FormData) {
	await prisma.cart.update({
		where: { id },
		data: getFormCart(formData),
	});
	updateTag("carts");
}

export { createCart, updateCart };
