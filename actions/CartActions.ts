"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

function getFormCart(formData: FormData) {
	const userId = Number(formData.get("userId"));
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

async function getCartsOptions() {
	const carts = await prisma.cart.findMany({
		select: { id: true, userId: true },
		orderBy: { id: "asc" },
	});
	return carts.map((c) => ({
		value: String(c.id),
		label: `Cart ${c.id} (User ${c.userId})`,
	}));
}

export { createCart, getCartsOptions, updateCart };
