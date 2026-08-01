"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

const tagMap: Record<string, string> = {
	user: "users",
	product: "products",
	order: "orders",
	cart: "carts",
	category: "categories",
	cartItem: "cart-items",
	orderItem: "order-items",
};

async function getEntityById(modelName: string, id: number) {
	try {
		// @ts-expect-error - prisma dynamic model access
		const data = await prisma[modelName].findUnique({ where: { id } });
		if (!data) return null;
		return JSON.parse(JSON.stringify(data));
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function deleteEntity(modelName: string, id: number) {
	try {
		// @ts-expect-error - prisma dynamic model access
		await prisma[modelName].delete({ where: { id } });

		const tag = tagMap[modelName];
		if (tag) {
			updateTag(tag);
		}
	} catch (error) {
		console.error(error);
	}
}

export { deleteEntity, getEntityById };
